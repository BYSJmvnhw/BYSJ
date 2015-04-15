package org.demo.dao.impl;

import net.sf.json.JSONObject;
import org.demo.dao.IBaseDao;
import org.demo.dao.ITeacherDao;
import org.demo.model.HwCourse;
import org.demo.model.HwTeacher;
import org.demo.tool.Page;
import org.demo.vo.ViewTeacher;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class TeacherDao extends BaseDao<HwTeacher> implements ITeacherDao {

    private IBaseDao<ViewTeacher> baseDao;
    @Resource
    public void setBaseDao(IBaseDao<ViewTeacher> baseDao){this.baseDao = baseDao;}

    public Page<ViewTeacher> searchTeacher(Integer campusId, Integer collegeId, Integer majorId, String teacherNo, String name) {
        StringBuilder hql = new StringBuilder("select new org.demo.vo.ViewTeacher(t.name,t.sex,t.email,t.id,t.teacherNo,"+
                "t.hwCollege.id,t.hwCollege.collegeName,t.hwCollege.hwCampus.id,t.hwCollege.hwCampus.name) from HwTeacher t " +
                "where t.deleteFlag=false ");
        List<Object> param = new ArrayList<Object>();
        List<String> stringList = new ArrayList<String>();
        if( campusId != null ) {
            hql.append( "and t.hwCampus.id = ? ");
            param.add(campusId);
        }
        if( collegeId != null ) {
            hql.append( "and t.hwCollege.id = ? ");
            param.add(collegeId);
        }
        if( majorId != null ) {
            hql.append( "and t.hwMajor.id = ? " );
            param.add(majorId);
        }
        if ( teacherNo != null && !teacherNo.equals("") ) {
            hql.append( "and t.teacherNo like ? " );
            stringList.add( "%" + teacherNo + "%" );
        }
        if( name!= null && !name.equals("") ) {
            hql.append( "and t.name like ? " );
            stringList.add( "%" + name + "%" );
        }
        String[] str = new String[stringList.size()];
        for(int i=0; i<str.length; i++) {
            str[i] = stringList.get(i);
        }
        return baseDao.findPage(hql.toString(), param.toArray(), str, 20);
    }
    public HwTeacher findDeletedTeacher(String teacherNo){
        String hql  = "from HwTeacher t where t.teacherNo = ? " +
                "and t.deleteFlag = true";
        return findObject(hql,teacherNo);
    }
}
