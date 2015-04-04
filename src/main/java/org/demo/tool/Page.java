package org.demo.tool;

import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/1/26.
 */

public class Page<T> {
    private List<T> data = new ArrayList<T>(0);
    private int pageOffset;
    private int pageSize;
    private long totalRecord;

    public List<T> getData() {
        return data;
    }
    public void setData(List<T> data) {
        this.data = data;
    }

    public int getPageOffset() {
        return pageOffset;
    }

    public void setPageOffset(int pageOffset) {
        this.pageOffset = pageOffset;
    }

    public int getPageSize() {
        return pageSize;
    }
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
    public long getTotalRecord() {
        return totalRecord;
    }
    public void setTotalRecord(long totalRecord) {
        this.totalRecord = totalRecord;
    }


}
