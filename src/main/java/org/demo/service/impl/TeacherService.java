package org.demo.service.impl;

import org.demo.dao.*;
import org.demo.model.HwTeacher;
import org.demo.model.HwUser;
import org.demo.tool.Page;
import org.demo.tool.UserType;
import org.demo.service.ITeacherService;
import org.demo.vo.ViewTeacher;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

/**
 * Created by jzchen on 2015/1/25.
 */
@Service
public class TeacherService implements ITeacherService {

    private ITeacherDao teacherDao;
    @Resource
    public void setTeacherDao(ITeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }
    private IUserDao userDao;
    @Resource
    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }
    private ICollegeDao collegeDao;
    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }
    private IMajorDao majorDao;
    @Resource
    public void setMajorDao(IMajorDao majorDao) {
        this.majorDao = majorDao;
    }
    private IBaseDao baseDao;
    @Resource
    public void setBaseDao(IBaseDao baseDao) {
        this.baseDao = baseDao;
    }

    public HwTeacher findTeacher(String teahcerNo) {
        String hql = " from HwTeacher t where t.teacherNo = ? ";
        return teacherDao.findObject(hql,teahcerNo);
    }
    //peifeng
    //2015-3-16晚上
    //通过教师号或者教师名字查询，因为名字可能相同，所以返回列表
    public List<ViewTeacher> findTeacherByNameNo(String queryParameter) {
        String hql = "select new org.demo.vo.ViewTeacher(" +
                "u.id,u.username,u.trueName,t.sex,t.email,t.id,t.teacherNo," +
                "t.hwCollege.id,t.hwCollege.collegeName,t.hwMajor.id,t.hwMajor.name,t.hwCollege.hwCampus.id,t.hwCollege.hwCampus.name) " +
                " from HwUser u,HwTeacher t" +
                " where u.typeId=t.id and u.userType=1 and t.teacherNo=?";
        String param1 = queryParameter,param2 = queryParameter;
        Object[] args = {param1,param2};
        return baseDao.list(hql,args);
    }
    //peifeng
    //2015-03-15晚上
    public Page<ViewTeacher> findTeacherList() {
        String hql = "select new org.demo.vo.ViewTeacher(" +
                "u.id,u.username,u.trueName,t.sex,t.email,t.id,t.teacherNo," +
                "t.hwCollege.id,t.hwCollege.collegeName,t.hwMajor.id,t.hwMajor.name,t.hwCollege.hwCampus.id,t.hwCollege.hwCampus.name) " +
                " from HwUser u,HwTeacher t" +
                " where u.typeId = t.id and u.userType = 1";
        return baseDao.findPage(hql);
    }
    //peifeng
    //2015-03-16上午
    public boolean addTeacher(int collegeId,int majorId,String teacherNo,String trueName,String sex,String mobile,String email,int createId,String createName) {
        //先添加教师
        HwTeacher teacher = new HwTeacher();
        teacher.setTeacherNo(teacherNo);
        teacher.setName(trueName);
        teacher.setSex(sex);
        //teacher.setEmail(email);
        teacher.setHwCollege(collegeDao.get(collegeId));
        teacher.setHwMajor(majorDao.get(majorId));
        teacherDao.add(teacher);
        //查找已经添加的教师
        HwTeacher oldTeacher = teacherDao.findObject("from HwTeacher t where t.teacherNo=?",teacherNo);
        if(oldTeacher == null) {
            return false;
        }else {
            //再添加用户
            HwUser user = new HwUser();
            user.setUsername(teacherNo);  //用户名与教师号相同
            user.setPassword(teacherNo);  //默认密码与用户名相同
            user.setTrueName(trueName);
            user.setCreateId(createId);
            user.setCreateUsername(createName);
            user.setCreateDate(new Timestamp(new Date().getTime()));
            user.setTypeId(oldTeacher.getId());
            user.setUserType(UserType.TEACHER);
            userDao.add(user);
            HwUser oldUser = userDao.findObject("from HwUser u where u.username=?",teacherNo);
            if(oldUser == null) {
                return false;
            }
        }
        return true;
    }
    //peifeng
    //2015-03-16上午
    public boolean updateTeacher(int collegeId,int majorId,int userId,int teacherId,String trueName,String sex,String email){
        HwTeacher oldTeacher = teacherDao.get(teacherId);
        oldTeacher.setName(trueName);
        oldTeacher.setSex(sex);
        //oldTeacher.setEmail(email);
        oldTeacher.setHwCollege(collegeDao.get(collegeId));
        oldTeacher.setHwMajor(majorDao.get(majorId));
        HwUser oldUser = userDao.get(userId);
        oldUser.setTrueName(trueName);
        teacherDao.update(oldTeacher);
        userDao.update(oldUser);
        return true;
    }
    //peifeng
    //2015-3-16晚上
    //分页获得指定学院的所有教师
    public Page<ViewTeacher> findTeacherByCollege(int collegeId) {
        String hql = "select new org.demo.vo.ViewTeacher(" +
                "u.id,u.username,u.trueName,t.sex,t.email,t.id,t.teacherNo," +
                "t.hwCollege.id,t.hwCollege.collegeName,t.hwMajor.id,t.hwMajor.name,t.hwCollege.hwCampus.id,t.hwCollege.hwCampus.name) " +
                " from HwUser u,HwTeacher t" +
                " where u.typeId=t.id and u.userType=1 and t.hwCollege.id=?";
        return baseDao.findPage(hql,collegeId);
    }
    //peifeng
    //2015-3-16晚上
    //分页获得指定专业的所有教师
    public Page<ViewTeacher> findTeacherByMajor(int majorId) {
        String hql = "select new org.demo.vo.ViewTeacher(" +
                "u.id,u.username,u.trueName,t.sex,t.email,t.id,t.teacherNo," +
                "t.hwCollege.id,t.hwCollege.collegeName,t.hwMajor.id,t.hwMajor.name,t.hwCollege.hwCampus.id,t.hwCollege.hwCampus.name) " +
                " from HwUser u,HwTeacher t" +
                " where u.typeId=t.id and u.userType=1 and t.hwMajor.id=?";
        return baseDao.findPage(hql,majorId);
    }
    //peifeng
    //2015-3-16晚上
    public ViewTeacher findTeacherByNo(String teacherNo) {
        String hql = "select new org.demo.vo.ViewTeacher(" +
                "u.id,u.username,u.trueName,t.sex,t.email,t.id,t.teacherNo," +
                "t.hwCollege.id,t.hwCollege.collegeName,t.hwMajor.id,t.hwMajor.name,t.hwCollege.hwCampus.id,t.hwCollege.hwCampus.name) " +
                " from HwUser u,HwTeacher t" +
                " where u.typeId=t.id and u.userType=1 and t.teacherNo=?";
        return (ViewTeacher)baseDao.findObject(hql,teacherNo);
    }

}
