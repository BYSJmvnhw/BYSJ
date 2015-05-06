package org.demo.service;


import net.sf.json.JSONObject;
import org.demo.model.HwThreadTime;

import java.util.List;

/**
 * Created by peifeng on 2015/3/19.
 */
public interface IThreadTimeService {
    public List<HwThreadTime> getData();
    public JSONObject updateDate(int id, int hour,int minute,int second,String name);
    public HwThreadTime get(int id);
}
