package com.AppCobranza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AppCobranzaApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppCobranzaApplication.class, args);
	}

}
