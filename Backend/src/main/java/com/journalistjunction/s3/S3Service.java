package com.journalistjunction.s3;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class S3Service {

    private final S3Client s3;

    public byte[] getObject(String bucketName, String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest
                .builder()
                .bucket(bucketName)
                .key(key)
                .build();

        ResponseInputStream<GetObjectResponse> res = s3.getObject(getObjectRequest);

        try {
            return res.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void putObject(String bucketName, String key, byte[] file) {
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3.putObject(objectRequest, RequestBody.fromBytes(file));
    }

    public void deleteAnObject(String bucketName, String objectKey) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();

            s3.deleteObject(deleteObjectRequest);
        } catch (IllegalStateException e) {
            throw new IllegalStateException("An Error Has Occurred While Trying To Post The Images! Please Try Again!");
        }
    }

    public void deleteMultipleObjects(String bucketName, List<String> objectsKeys) {

        ArrayList<ObjectIdentifier> toDelete = new ArrayList<>();
        for (String objKey : objectsKeys) {
            toDelete.add(ObjectIdentifier.builder()
                    .key(objKey)
                    .build());
        }

        try {
            DeleteObjectsRequest deleteObjectRequest = DeleteObjectsRequest.builder()
                    .bucket(bucketName)
                    .delete(Delete.builder()
                            .objects(toDelete).build())
                    .build();

            s3.deleteObjects(deleteObjectRequest);
        } catch (IllegalStateException e) {
            throw new IllegalStateException("An Error Has Occurred While Trying To Post The Images! Please Try Again!");
        }
    }

}
