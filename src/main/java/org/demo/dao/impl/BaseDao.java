package org.demo.dao.impl;

import org.demo.dao.IBaseDao;
import org.demo.tool.Page;
import org.demo.tool.SystemContext;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

/**
 * Created by jzchen on 2014/12/25.
 */

@Repository
public class BaseDao<T> implements IBaseDao<T> {

    private SessionFactory sessionFactory;
    private Class<T> clz;


    @Resource
    public final void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    //获得session
    /*protected Session getSession() {
        return sessionFactory.openSession();
    }*/
    protected Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    //通过反射获得泛型类型
    @SuppressWarnings("unchecked")
    public Class<T> getClz() {
        if(this.clz == null) {
            clz = (Class<T>)(
                (ParameterizedType)getClass()    //Class字节码
                .getGenericSuperclass()
                )        //因为对于T.class我们无法获取，但是这个方法就能获取到父类的参数类型，返回值为ParameterizedType
                .getActualTypeArguments()[0];    //数组里第一个就是子类继承父类时所用类型
        }
        return clz;
    }



    @Override
    public void add(T t) {
            getSession().save(t);
    }

    @Override
    public void delete(T t) {
        getSession().delete(t);
    }

    @Override
    public T get(Serializable id) {
        return (T)getSession().get(this.getClz(),id);
    }

    @Override
    public T load(Serializable id) {
        return (T)getSession().load(this.getClz(),id);
    }

    @Override
    public void update(T t) {
        getSession().update(t);
    }

    @Override
    public List<T> list(String hql, Object[] args) {
        Query q = getSession().createQuery(hql);
        if( args != null){
            for(int i=0; i<args.length; i++) {
                q.setParameter(i, args[i]);
            }
        }
        List<T> list  = q.list();
        return list;
    }

    @Override
    public List<T> list(String hql, Object arg) {
        return this.list(hql,new Object[]{arg});
    }

    @Override
    public List<T> list(String hql) {
        return this.list(hql,null);
    }

    @Override
    public T findObject(String hql, Object[] args) {
        Query q = getSession().createQuery(hql);
        if( args != null){
            for(int i=0; i<args.length; i++) {
                q.setParameter(i, args[i]);
            }
        }
        T t  =  (T) q.uniqueResult();
        return t;
    }

    @Override
    public T findObject(String hql, Object arg) {
        return this.findObject(hql, new Object[]{arg});
    }

    @Override
    public T findObject(String hql) {
        return this.findObject(hql, null);
    }

    @Override
    public T findObjectWithSql(String sql, Object[] args)
    {
        SQLQuery sq = getSession().createSQLQuery(sql);
        if( args != null ){
            for( int i =0; i<args.length; i++ ) {
                sq.setParameter( i, args[i] );
            }
        }
        T t = (T) sq.uniqueResult();
        return t;
    }

    @Override
    public T findObjectWithSql(String sql, Object arg) {
        return this.findObjectWithSql(sql, new Object[] {arg});
    }

    @Override
    public T findObjectWithSql(String sql) {
        return this.findObjectWithSql(sql, null);
    }

    @Override
    public Page<T> findPage(String hql, Object[] params, String[] strings) {
        Page<T> page = new Page<T>();
        int pageOffset = SystemContext.getPageOffset();
        int pageSize = SystemContext.getPageSize();
        Query q = getSession().createQuery(hql);
        /*  获取计数hql */
        Query cq = getSession().createQuery(getCountHql(hql));
        /** 记录 strings 下标的初始值*/
        int j=0;
        if( params!=null ) {
            for (int i = 0; i < params.length; i++,j++) {
                q.setParameter(i, params[i]);
                cq.setParameter(i, params[i]);
            }
        }
        if( strings != null ) {
            for (int i = 0; i < strings.length ; i++) {
                q.setString(i+j, strings[i]);
                cq.setString(i+j, strings[i]);
            }
        }
        /* 获取记录条数 */
        // System.out.println(q.toString());
        long totalRecord =(Long) cq.uniqueResult();
        q.setFirstResult(pageOffset);
        q.setMaxResults(pageSize);
        /* 获取分页数据 */
        List data = q.list();
        page.setData(data);
        page.setPageOffsset(pageOffset);
        page.setPageSize(pageSize);
        page.setTotalRecord(totalRecord);
        return page;
    }

    @Override
    public Page<T> findPage(String hql, Object[] params, String string) {
        return this.findPage(hql, params, new String[]{string});
    }

    @Override
    public Page<T> findPage(String hql, Object[] params) {
        return this.findPage(hql, params, (String[]) null);
    }

    @Override
    public Page<T> findPage(String hql, Object param, String[] strings) {
        return this.findPage(hql, new Object[]{param}, strings);
    }

    @Override
    public Page<T> findPage(String hql, Object param, String string) {
        return this.findPage(hql, new Object[]{param}, new String[]{string});
    }

    @Override
    public Page<T> findPage(String hql, String[] strings) {
        return this.findPage(hql, null, strings);
    }

    @Override
    public Page<T> findPage(String hql, String string) {
        return this.findPage(hql, null, new String[]{string});
    }

    @Override
    public Page<T> findPage(String hql, Object param) {
        return this.findPage(hql, new Object[] {param}, (String[])null);
    }

    @Override
    public Page<T> findPage(String hql) {
        return this.findPage(hql, null, (String[]) null);
    }

    @Override
    /*  通过 hql 获取计数 hql */
    public String  getCountHql(String hql) {
        String newhql;
        String oldSub = hql.substring(0, hql.indexOf("from"));
        if ( oldSub.trim().equals("") )
            newhql = " select count(*) "  + hql;
        else
            newhql = hql.replace( oldSub, " select count(*) ");
        return newhql;
    }

}
