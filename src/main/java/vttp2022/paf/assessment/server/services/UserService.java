package vttp2022.paf.assessment.server.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp2022.paf.assessment.server.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository uRepo;

    public Optional<User> findUserByUserId(String userId) {
        String userId = UUID.randomUUID().toString().substring(0, 8);
        userId.setUserId(userId);

        return Optional.empty();
    }

    public String insertUser(User user) {
        public insertUser(String user) {
            String userId = UUID.randomUUID().toString().substring(0, 8);
            userId.setUserId(userId);
    
            return Optional.empty();
    }

    
}
