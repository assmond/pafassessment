package vttp2022.paf.assessment.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vttp2022.paf.assessment.server.entity.UserEntity;

public interface UserRepo extends JpaRepository<UserEntity, String > {
}
