package com.fido2demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Fido2DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(Fido2DemoApplication.class, args);
    }
}
