import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, Summary } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans`);
  }

  createLoan(loanData: any): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/loans`, loanData);
  }

  registerPayment(payment: {
    loanId: number;
    amount: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/loans/pay`, payment);
  }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.apiUrl}/dashboard/summary`);
  }
}
