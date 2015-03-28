package org.demo.dao.impl;

import org.demo.dao.IStudentDao;
import org.demo.model.HwStudent;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class StudentDao extends BaseDao<HwStudent> implements IStudentDao {
    @Override
    public HwStudent findStudnetByStudentNo(String studentNo) {
        String hql  = "from HwStudent st where st.studentNo = ? " +
                "and st.deleteFlag = false";
        return findObject(hql,studentNo);
    }

    @Override
    public HwStudent findDeleteStudnet(String studentNo) {
        String hql  = "from HwStudent st where st.studentNo = ? " +
                "and st.deleteFlag = true";
        return findObject(hql,studentNo);
    }

    @Override
    public Page<HwStudent> searchStudent(Integer campusId, Integer collegeId, Integer majorId, String studentNo, String name) {
        StringBuilder hql = new StringBuilder("from HwStudent st where 1=1 ");
        List<Object> param = new ArrayList<Object>();
        List<String> stringList = new ArrayList<String>();
        if( campusId != null ) {
            hql.append( "and st.hwCampus.id = ? ");
            param.add(campusId);
        }
        if( collegeId != null ) {
            hql.append( "and st.hwCollege.id = ? ");
            param.add(collegeId);
        }
        if( majorId != null ) {
            hql.append( "and st.hwMajor.id = ? " );
            param.add(majorId);
        }
        if ( studentNo != null && !studentNo.equals("") ) {
            hql.append( "and st.studentNo like ? " );
            stringList.add( "%" + studentNo + "%" );
        }
        if( name!= null && !name.equals("") ) {
            System.out.println(name);
            hql.append( "and st.name like ? " );
            stringList.add( "%" + name + "%" );
        }
        String[] str = new String[stringList.size()];
        for(int i=0; i<str.length; i++) {
            str[i] = stringList.get(i);
        }
        return findPage(hql.toString(), param.toArray(), str);
    }
}
