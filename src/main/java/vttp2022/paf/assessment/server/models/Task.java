package vttp2022.paf.assessment.server.models;

// TODO: fill in this class according to the assessment tasks

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Task {

        private String taskId;
        private String description;
        private String priority;
        private String dueDate;

}


