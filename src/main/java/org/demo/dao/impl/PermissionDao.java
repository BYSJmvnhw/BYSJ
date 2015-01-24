package org.demo.dao.impl;

import org.demo.dao.IPermissionDao;
import org.demo.model.HwPermission;
import org.springframework.stereotype.Repository;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class PermissionDao extends BaseDao<HwPermission> implements IPermissionDao {
}
