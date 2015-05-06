package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.model.HwUser;
import org.demo.service.IExcelService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * Created by peifeng on 2015/3/25.
 */
@Controller
@RequestMapping(value="/ExcelOperate")
public class ExcelController {
    private IExcelService excelService;
    @Resource
    public void setExcelService(IExcelService excelService) {
        this.excelService = excelService;
    }

    @RequestMapping(value = "/studentToExcel", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject studentToExcel(int ctid) {
        return excelService.getStudentExcel(ctid);
    }
    @RequestMapping(value = "/excelToStudent", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject excelToStudent(HttpServletRequest request) {
        HwUser loginUser = (HwUser)request.getSession().getAttribute("loginUser");
        return excelService.saveFromExcelToStudent(request,loginUser);
    }
}
