package org.demo.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.zhuozhengsoft.pageoffice.*;
import net.sf.json.JSONObject;
import org.demo.model.HwHomework;
import org.demo.model.HwTeacher;
import org.demo.model.HwUser;
import org.demo.service.IHomeworkService;
import org.demo.service.ITeacherService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/homework")
public class OpenWordController {

    private static final long serialVersionUID = -758686623642845302L;

	private IHomeworkService homeworkService;
	private String homeworkBaseDir;
    private String message = "111";

	public String getMessage(){
    	return message;
    }

	private ITeacherService teacherService;
	@RequestMapping("/openword")
	public String openword(Integer hwId, HttpServletRequest request) throws Exception {
		PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
		/**
		 * 设置 PageOfficeCtrl 控件的运行服务页面
		 * */
		// 访问的是当前的相对路径，web.xml中 servlet的 url-pattern 必须拦截webapp根目录之后的路径，此处为 homework/poserver.do
		poCtrl1.setServerPage("poserver.do"); //此行必须

		try{
			//获取作业的url
			HwHomework homework = homeworkService.load(hwId);
			String url = homework.getUrl();
			//获取批改作业的教师名
			HwUser user = (HwUser)request.getSession().getAttribute("loginUser");
			HwTeacher teacher = teacherService.load(user.getTypeId());
			String name  = teacher.getName();
			//新建PageOfficeCtrl对象

			// Create custom toolbar
			poCtrl1.addCustomToolButton("保存", "SaveDocument()", 1);
			poCtrl1.addCustomToolButton("-", "", 0);
			poCtrl1.addCustomToolButton("打印", "ShowPrintDlg()", 6);
			poCtrl1.addCustomToolButton("-", "", 0);
			poCtrl1.addCustomToolButton("全屏切换", "SetFullScreen()", 4);
			poCtrl1.addCustomToolButton("-", "", 0);
			poCtrl1.addCustomToolButton("加盖印章", "AddSeal()", 5);
			poCtrl1.addCustomToolButton("手写签批", "AddHandSign()", 5);
			poCtrl1.addCustomToolButton("验证印章", "VerifySeal()", 5);
			//文档保存需要访问的controller，需要当前的相对路径或者绝对路径。
			poCtrl1.setSaveFilePage("saveword");
			//设置打开文件的绝对路径
			//poCtrl1.webOpen( homeworkBaseDir + "/doc/test.doc", OpenModeType.docNormalEdit, "张三");
			poCtrl1.webOpen( homeworkBaseDir + "/doc" + url, OpenModeType.docNormalEdit, name);
			poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须
			return "homework/editword";
		} catch (Exception e) {
			e.printStackTrace();
			poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须
			return "homework/editword";
		}
	}

	@RequestMapping("/saveword")
	public String saveword(HttpServletRequest request,HttpServletResponse response) throws Exception {
		FileSaver fs = new FileSaver(request, response);
		try {
			request.setAttribute("FileSaver", fs); //在跳转后的页面关闭FileSaver需要设置属性。
			//获取磁盘路径
			String driverPath = homeworkBaseDir.substring(0, homeworkBaseDir.indexOf("\\"));
			//System.out.println("driverPath -->" + driverPath);
			System.out.println(homeworkBaseDir.indexOf("\\"));
			//fs.getFileName()只获取到磁盘路径第一个反斜杠之后，如 D:\
			fs.saveToFile(driverPath + "\\" + fs.getFileName());
			//fs.showPage(300, 200);
			message = "保存成功！";
			//request.setAttribute("message",message);
			fs.setCustomSaveResult("success");
			return "homework/savefile";
		}catch (Exception e){
			e.printStackTrace();
			fs.setCustomSaveResult("fail");
			return "homework/savefile";
		}finally {
			/**
			 * 必须在跳转到的页面关闭FileSaver，调用 fs.close();
			 * */
			//fs.close();
		}
	}

	public String getHomeworkBaseDir() {
		return homeworkBaseDir;
	}

	@Value("${homeworkDir}")
	public void setHomeworkBaseDir(String homeworkBaseDir) {
		this.homeworkBaseDir = homeworkBaseDir;
	}

	public IHomeworkService getHomeworkService() {
		return homeworkService;
	}

	@Resource
	public void setHomeworkService(IHomeworkService homeworkService) {
		this.homeworkService = homeworkService;
	}

	public ITeacherService getTeacherService() {
		return teacherService;
	}

	@Resource
	public void setTeacherService(ITeacherService teacherService) {
		this.teacherService = teacherService;
	}
}