package vttp2022.paf.assessment.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vttp2022.paf.assessment.server.entity.TaskEntity;


@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, String> {
}
