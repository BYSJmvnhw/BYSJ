package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Created by jzchen on 2015/1/14.
 */
public interface IHomeworkService {

    public void add(HwHomework homework);

    public void load(Integer id);

    public void update(HwHomework homework);

    public JSONObject homeworkPage(Integer courseTeachingId, Integer studentId);

    public JSONObject submittedHomeworkPage(Integer hwInfoId, boolean submited);

    public JSONObject courseSelectingPage(HwStudent student, Integer startYear, Integer schoolTerm);

    public JSONObject courseTeachingPage(HwTeacher teacher, Integer startYear, Integer schoolTerm);

    public JSONObject homeworListInfoPage(Integer courseTeachingId);

    public JSONObject homeworkInfoDetail(Integer hwInfoId);

    public void addHomeworkInfo(String jsonObject, HwTeacher teacher);

    public void upload(MultipartFile hw, Integer hwinfoId,HwStudent student, String backupPath) throws IOException;

    public void deleteHomeworkInfo(Integer hwInfoId);
}
