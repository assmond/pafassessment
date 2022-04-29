package vttp2022.paf.assessment.server.repositories;

// TODO: fill in this class according to the assessment tasks

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import vttp2022.paf.assessment.server.models.User;

import java.util.Optional;
import java.util.UUID;

public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<User> findUserByUserId(String userId) {
        return Optional.of(jdbcTemplate.queryForObject("select * from user where id=?", new Object[] {
                        userId
                },
                new BeanPropertyRowMapper< User >(User.class)));
    }

    public String insertUser(User user) {
        user.setUserId(UUID.randomUUID().toString());
        jdbcTemplate.update("INSERT INTO user (user_id, username, name) " + "values(?, ?, ?)",
                new Object[] {
                        user.getUserId(), user.getUsername(), user.getName()
                });
        return user.getUserId();
    }
}
