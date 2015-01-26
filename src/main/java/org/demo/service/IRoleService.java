package org.demo.service;

import org.demo.model.HwRole;

import java.io.Serializable;

/**
 * Created by jzchen on 2015/1/26.
 */
public interface IRoleService {
    public HwRole load(Serializable id);
}
