package com.project.resume.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path baseDir;

    public FileStorageService(@Value("${app.storage.base-dir:uploads}") String baseDir) throws IOException {
        this.baseDir =Path.of(baseDir) ;
        Files.createDirectories(this.baseDir);
    }
    public StoredFile save(MultipartFile file) throws IOException {
        String ext = getExt(file.getOriginalFilename());
        String name = UUID.randomUUID() + (ext.isEmpty()?"":"."+ext);
        Path path = baseDir.resolve(name);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        return new StoredFile(name, path.toString(), Instant.now());
    }
    private String getExt(String name) {
        if (name == null) return "";
        int i = name.lastIndexOf('.');
        return i>0 ? name.substring(i+1) : "";
    }


    public record StoredFile(String fileName, String absolutePath, Instant savedAt) {}
}

