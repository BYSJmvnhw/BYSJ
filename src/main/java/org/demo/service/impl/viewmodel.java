package org.demo.service.impl;

/**
 * Created by peifeng on 2015/3/15.
 */
public class viewmodel {

    public viewmodel(String u) {
        this.url = u;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    private String url;

}
