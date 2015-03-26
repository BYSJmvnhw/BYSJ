package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.model.HwStudent;
import org.demo.service.IExportExcelService;
import org.demo.tool.GetRealPath;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by peifeng on 2015/3/25.
 */
@Controller
public class ExcelController {
    private IExportExcelService exportExcelService;
    @Resource
    public void setExportExcelService(IExportExcelService exportExcelService) {
        this.exportExcelService = exportExcelService;
    }

    @RequestMapping(value = "/doexcel", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject saveStudentExcel(int teacherId,int courseId,int startYear,int schoolTerm) {
        return exportExcelService.getStudentExcel(teacherId,courseId,startYear,schoolTerm);
    }
}
