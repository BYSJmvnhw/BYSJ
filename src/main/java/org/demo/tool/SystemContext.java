package org.demo.tool;

/**
 * Created by jzchen on 2015/1/26.
 */
public class SystemContext {

    /*
     * 每个单独的线程都维护一个map，
     * ThreadLocal对象作为map中的key，类型参数为value的类型
     * 用于在同一个线程中进行数据传递
     */
    private static ThreadLocal<Integer> pageOffset = new ThreadLocal<Integer>();
    private static ThreadLocal<Integer> pageSize = new ThreadLocal<Integer>();


    public static int getPageOffset() {
        return pageOffset.get();
    }
    public static void setPageOffset(int _pageOffset) {
        pageOffset.set(_pageOffset);
    }
    public static int getPageSize() {
        return pageSize.get();
    }
    public static void setPageSize(int _pageSize) {
        pageSize.set(_pageSize);
    }
    public static void removePageOffset() {
        pageOffset.remove();
    }
    public static void removePageSize() {
        pageSize.remove();
    }

}