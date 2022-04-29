package vttp2022.paf.assessment.server.controllers;

// TODO: fill in this class according to the assessment tasks

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import vttp2022.paf.assessment.server.models.Task;
import vttp2022.paf.assessment.server.models.User;
import vttp2022.paf.assessment.server.services.TodoService;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
public class TasksController {
    @Autowired
    TodoService todoService;

    @PostMapping("task")
    public ModelAndView save(@RequestBody MultiValueMap payload) {

        ModelAndView mvc = new ModelAndView();

        User user = new User();
        user.setUsername((String) payload.getFirst("username"));
        List<Task> taskList = create(payload);
        try {
            todoService.upsertTask(taskList, user);
            mvc.addObject("taskCount", taskList.size());
            mvc.addObject("username", user.getName());
            mvc.setStatus(HttpStatus.OK);
            mvc.setViewName("result");
        } catch (Exception e) {
            e.printStackTrace();
            mvc.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            mvc.setViewName("error");
        }

        return mvc;
    }

    private List<Task> create(MultiValueMap payload) {
        List<Task> taskList = new ArrayList();

        int i = 0;
        while (i < (payload.size() / 3)) {
            String description = (String) payload.getFirst("description-%d".formatted(i));
            String priority = (String) payload.getFirst("priority-%d".formatted(i));
            String dueDate = (String) payload.getFirst("dueDate-%d".formatted(i));

            Task task = new Task();
            task.setDescription(description);
            task.setPriority(priority);
            task.setDueDate(dueDate);

            taskList.add(task);

            i++;
        }

        return taskList;
    }
}
