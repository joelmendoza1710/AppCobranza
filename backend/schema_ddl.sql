-- Enable UUID extension if needed, though we seem to use Identity/Serial
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS (PostgreSQL specific, or handled as strings in Java)
CREATE TYPE user_role AS ENUM ('ADMIN', 'COBRADOR');
CREATE TYPE loan_status AS ENUM ('AL_DIA', 'MORA', 'ADELANTADO', 'VENCIDO_CARTERA', 'PAGADO');
CREATE TYPE payment_frequency AS ENUM ('DIARIO', 'SEMANAL');
CREATE TYPE audit_status AS ENUM ('PENDIENTE_CUADRE', 'APROBADO', 'RECHAZADO');

-- 2. USERS
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- Enum mapping: ADMIN, COBRADOR
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. RUTAS
CREATE TABLE rutas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cobrador_id BIGINT UNIQUE, -- OneToOne with User (Cobrador)
    CONSTRAINT fk_ruta_cobrador FOREIGN KEY (cobrador_id) REFERENCES users(id)
);

-- 4. CLIENTES
CREATE TABLE clientes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE, 
    telefono VARCHAR(20),
    direccion TEXT,
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION,
    rifas VARCHAR(50), -- Nro de sorteo opcional
    adjuntos_url TEXT, -- Podria ser JSONB si son multiples
    orden_visita DOUBLE PRECISION DEFAULT 0.0, -- Permite decimales para reordenamiento (1.5)
    ruta_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cliente_ruta FOREIGN KEY (ruta_id) REFERENCES rutas(id)
);

-- 5. PRESTAMOS (LOANS)
CREATE TABLE loans (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL, -- Quien creo el prestamo
    
    amount DECIMAL(19, 2) NOT NULL, -- Monto Capital prestado
    interest_percentage DECIMAL(5, 2) NOT NULL, -- Tasa mensual
    installments INTEGER NOT NULL, -- Plazo dias/semanas
    payment_frequency VARCHAR(20) NOT NULL, -- DIARIO, SEMANAL
    installment_amount DECIMAL(19, 2) NOT NULL, -- Cuota fija pactada
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    total_to_pay DECIMAL(19, 2) NOT NULL, -- Capital + Interes
    remaining_balance DECIMAL(19, 2) NOT NULL, -- Saldo pendiente total
    
    -- Saldos desglosados para contabilidad precisa
    capital_balance DECIMAL(19, 2) NOT NULL, 
    interest_balance DECIMAL(19, 2) NOT NULL,
    
    status VARCHAR(20) NOT NULL, -- ENUM: AL_DIA, MORA...
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_client FOREIGN KEY (client_id) REFERENCES clientes(id),
    CONSTRAINT fk_loan_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 6. PAGOS (PAYMENTS)
CREATE TABLE payments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    loan_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL, -- Quien cobro (Cobrador)
    
    amount DECIMAL(19, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Desglose contable
    capital_amount DECIMAL(19, 2) DEFAULT 0,
    interest_amount DECIMAL(19, 2) DEFAULT 0,
    
    observation TEXT, -- Obligatorio si pago < cuota
    audit_status VARCHAR(20) DEFAULT 'PENDIENTE_CUADRE', -- PENDIENTE_CUADRE, APROBADO
    
    CONSTRAINT fk_payment_loan FOREIGN KEY (loan_id) REFERENCES loans(id),
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 7. GASTOS DE CAJA
CREATE TABLE gastos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- Gasolina, Nomina, Reparaciones
    monto DECIMAL(19, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ruta_id BIGINT, -- Gasto asociado a una ruta/cobrador
    descripcion TEXT,
    CONSTRAINT fk_gasto_ruta FOREIGN KEY (ruta_id) REFERENCES rutas(id)
);

-- 8. VALES DE EMPLEADO (Prestamos internos)
CREATE TABLE vales_empleado (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    monto DECIMAL(19, 2) NOT NULL,
    cuotas INTEGER DEFAULT 1,
    saldo_pendiente DECIMAL(19, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vale_empleado FOREIGN KEY (empleado_id) REFERENCES users(id)
);

-- INDEXES
CREATE INDEX idx_cliente_orden ON clientes(orden_visita);
CREATE INDEX idx_loan_status ON loans(status);
CREATE INDEX idx_payment_date ON payments(date);
