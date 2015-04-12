package org.demo.dao.impl;

import org.demo.dao.IUserDao;
import org.demo.model.HwUser;
import org.demo.tool.Page;
import org.demo.tool.UserType;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class UserDao extends BaseDao<HwUser> implements IUserDao {

    @Override
    public HwUser findUserByTypeId(Integer typeId) {
        String hql = "from HwUser u where " +
                "u.typeId = ?";
        return findObject(hql, typeId);
    }

    @Override
    public HwUser findUserByUsername(String username) {
        String hql = "from HwUser u where " +
                "u.username = ?";
        return findObject(hql, username);
    }

    @Override
    public Page<HwUser> userList(String username, String trueName, String userType) {
        StringBuilder hql = new StringBuilder("from HwUser u where 1=1 ");
        List<Object> params = new ArrayList<Object>();
        List<String>  stringList = new ArrayList<String>();
        if( userType != null  ){
            hql.append("and u.userType = ? ");
            params.add(UserType.valueOf(userType));
        }
        if( username != null && !username.equals("") ){
            hql.append("and u.username like ? ");
            stringList.add(username);
        }if( trueName != null && !trueName.equals("") ){
            hql.append("and u.trueName like ? ");
            stringList.add(trueName);
        }
        String[] str = new String[stringList.size()];
        for(int i=0; i<str.length; i++) {
            str[i] = stringList.get(i);
        }
        return findPage(hql.toString(), params.toArray(), str, 20);
    }
}
