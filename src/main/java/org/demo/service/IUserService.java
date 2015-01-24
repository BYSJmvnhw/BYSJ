package org.demo.service;

import org.demo.model.HwUser;

import java.io.Serializable;

/**
 * Created by jzchen on 2015/1/14.
 */
public interface IUserService {
    public HwUser load(Serializable id);
    public HwUser findUser(String username);
}
