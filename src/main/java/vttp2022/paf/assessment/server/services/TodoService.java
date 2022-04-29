package vttp2022.paf.assessment.server.services;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import vttp2022.paf.assessment.server.entity.TaskEntity;
import vttp2022.paf.assessment.server.entity.UserEntity;
import vttp2022.paf.assessment.server.models.Task;
import vttp2022.paf.assessment.server.models.User;
import vttp2022.paf.assessment.server.repositories.TaskRepository;
import vttp2022.paf.assessment.server.repositories.UserRepo;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

// TODO: fill in this class according to the assessment tasks
@Service
public class TodoService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    UserRepo userRepo;

    @Autowired
    TaskRepository taskRepository;

    @Transactional
    public void upsertTask(List<Task> taskList, User user) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setName(user.getUsername().toUpperCase());

        List<TaskEntity> entities = new ArrayList<>();

        for (Task task : taskList) {
            TaskEntity taskEntity = new TaskEntity();
            BeanUtils.copyProperties(task, taskEntity);
            taskEntity.setUser(userEntity);

            entities.add(taskEntity);
        }
        userRepo.save(userEntity);
        taskRepository.saveAll(entities);


    }

}
