package org.demo.service;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.demo.model.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Created by jzchen on 2015/1/14.
 */
public interface IHomeworkService {

    public void add(HwHomework homework);

    public HwHomework load(Integer id);

    public void update(HwHomework homework);

    public JSONObject homeworkPage(Integer courseTeachingId, Integer studentId);

    public JSONObject submittedHomeworkPage(Integer hwInfoId, boolean submited);

    public JSONObject courseSelectingPage(HwUser user, Integer startYear, Integer schoolTerm);

    public JSONObject courseTeachingPage(HwUser user, Integer startYear, Integer schoolTerm);

    public JSONArray homeworListInfo(Integer courseTeachingId);

    public JSONObject homeworkInfoDetail(Integer hwInfoId);

    public void addHomeworkInfo(String jsonObject, HwUser user) throws Exception;

    public void upload(MultipartFile hw, Integer hwinfoId,HwUser user, String backupPath) throws IOException;

    public void deleteHomeworkInfo(Integer hwInfoId) throws Exception;

    public void markHomework(Integer I, String mark, String comment);
}
