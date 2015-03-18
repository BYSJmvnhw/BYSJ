package org.demo.dao;

import org.demo.model.Page;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

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

    public Page<T> findPage(String hql, Object[] params, String[] strings);

    public Page<T> findPage(String hql, Object[] params, String string);

    public Page<T> findPage(String hql, Object[] params);

    public Page<T> findPage(String hql, Object param, String[] strings);

    public Page<T> findPage(String hql, Object param, String string);

    public Page<T> findPage(String hql, Object param);

    public Page<T> findPage(String hql, String[] strings);

    public Page<T> findPage(String hql, String string);

    public Page<T> findPage(String hql);



    /*  通过 hql 获取计数 hql */
    public String  getCountHql(String hql);
}