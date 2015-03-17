package org.demo.service;

import org.demo.model.HwTeacher;
import org.demo.vo.ViewTeacher;

import java.util.List;

/**
 * Created by jzchen on 2015/1/25.
 */
public interface ITeacherService {
    public HwTeacher findTeacher(String teahcerNo);

}
