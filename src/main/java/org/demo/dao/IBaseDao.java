package org.demo.dao;

import org.demo.tool.Page;

import javax.persistence.OneToMany;
import java.io.Serializable;
import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */

public interface IBaseDao<T> {
    public void add(T t);

    public void delete(T t);

    public T get(Serializable id);

    public T load(Serializable id);

    public void update(T t);

    public List<T> list(String hql, Object[] args);

    public List<T> list(String hql, Object arg);

    public List<T> list(String hql);

    public T findObject(String hql, Object[] args);

    public T findObject(String hql, Object arg);

    public T findObject(String hql);

    public T findObjectWithSql(String sql, Object[] args);

    public T findObjectWithSql(String sql, Object arg);

    public T findObjectWithSql(String sql);

    //可以修改默认分页大小，但要用原始方法
    public Page<T> findPage(String hql, Object[] params, String[] strings, Integer pageSize);

    public Page<T> findPage(String hql, Object[] params, String[] strings);

    public Page<T> findPage(String hql, Object[] params, String string);

    public Page<T> findPage(String hql, Object[] params);

    public Page<T> findPage(String hql, Object param, String[] strings);

    public Page<T> findPage(String hql, Object param, String string);

    public Page<T> findPage(String hql, Object param);

    public Page<T> findPage(String hql, String[] strings);

    public Page<T> findPage(String hql, String string);

    public Page<T> findPage(String hql);

    public Long count(String hql, Object[] params);

    public Long count(String hql, Object param);

    public Long count(String hql);

    //返回列表分页但非分页类
    public List pageList(String hql, Object[] params, Integer pageSize);

    /*  通过 hql 获取计数 hql */
    public String  getCountHql(String hql);

    //sql查询分页列表
    //public List  listWithSql(String sql, Object[] params, Integer pageSize);

    //public List listWithSql(String sql, Object param, Integer pageSize);

    //public List listWithSql(String sql,  Integer pageSize);

    public List listWithSql(String sql,  Object[] params);

    public List listWithSql(String sql, Object param);

    public List listWithSql(String sql);
}