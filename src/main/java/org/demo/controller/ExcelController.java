package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.model.HwStudent;
import org.demo.model.HwUser;
import org.demo.service.IExportExcelService;
import org.demo.tool.GetRealPath;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by peifeng on 2015/3/25.
 */
@Controller
@RequestMapping(value="/ExcelOperate")
public class ExcelController {
    private IExportExcelService exportExcelService;
    @Resource
    public void setExportExcelService(IExportExcelService exportExcelService) {
        this.exportExcelService = exportExcelService;
    }

    @RequestMapping(value = "/studentToExcel", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject studentToExcel(int teacherId,int courseId,int startYear,int schoolTerm) {
        return exportExcelService.getStudentExcel(teacherId,courseId,startYear,schoolTerm);
    }
    @RequestMapping(value = "/excelToStudent", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject excelToStudent(HttpServletRequest request) {
        HwUser loginUser = (HwUser)request.getSession().getAttribute("loginUser");
        return exportExcelService.saveFromExcelToStudent(request,loginUser);
    }
}
