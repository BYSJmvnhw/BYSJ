package org.demo.dao.impl;

import org.demo.dao.IBaseDao;
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


public class BaseDao<T> implements IBaseDao<T> {

    private SessionFactory sessionFactory;
    private Class<T> clz;


    @Resource
    public final void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    //获得session
    protected Session getSession() {
        return sessionFactory.openSession();
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
    public void delete(Serializable id) {
        getSession().delete(this.load(id));
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





}
