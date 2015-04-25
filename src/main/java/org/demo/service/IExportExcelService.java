package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwCourse;
import org.demo.model.HwStudent;
import org.demo.model.HwUser;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by peifeng on 2015/3/25.
 */
public interface IExportExcelService {
    public JSONObject getStudentExcel(int ctid);
    public JSONObject saveFromExcelToStudent(HttpServletRequest request,HwUser createUser);
}
