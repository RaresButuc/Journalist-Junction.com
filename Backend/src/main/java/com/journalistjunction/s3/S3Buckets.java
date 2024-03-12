package com.journalistjunction.s3;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
@ConfigurationProperties(prefix = "aws.s3.buckets.customer")
public class S3Buckets {

    private String customer;

}