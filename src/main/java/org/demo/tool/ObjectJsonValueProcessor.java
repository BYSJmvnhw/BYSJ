package org.demo.tool;

/**
 * Created by jzchen on 2015/3/13 0013.
 */

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;

/**
 * 解决JSONObject.fromObject抛出"There is a cycle in the hierarchy"异常导致死循环的解决办法
 * @author LuoYu
 * @date 2012-11-23
 */
public class ObjectJsonValueProcessor implements JsonValueProcessor {

    /**
     * 需要留下的字段数组
     */
    private String[] properties;

    /**
     * 需要做处理的复杂属性类型
     */
    private Class<?> clazz;

    /**
     * 构造方法,参数必须
     * @param properties
     * @param clazz
     */
    public ObjectJsonValueProcessor(String[] properties,Class<?> clazz){
        this.properties = properties;
        this.clazz =clazz;
    }

    @Override
    public Object processArrayValue(Object value, JsonConfig jsonConfig) {
        return "";
    }

    @Override
    public Object processObjectValue(String key, Object value, JsonConfig jsonConfig) {
        PropertyDescriptor pd = null;
        Method method = null;
        StringBuffer json = new StringBuffer("{");
        try{
            for(int i=0;i<properties.length;i++){
                pd = new PropertyDescriptor(properties[i], clazz);
                method = pd.getReadMethod();
                //System.out.println(method.invoke(value));
                //System.out.println(method.invoke(value).getClass().getName());
                //System.arraycopy();
                if( method.invoke(value) instanceof Integer ){
                    Integer v = (Integer)method.invoke(value);
                    json.append("'"+properties[i]+"':"+v);
                }else {
                    String v = String.valueOf(method.invoke(value));
                    json.append("'"+properties[i]+"':'"+v+"'");
                }
                /** 未到尾部则添加“,”*/
                json.append(i != properties.length-1?",":"");
            }
            json.append("}");
        }catch (Exception e) {
            e.printStackTrace();
        }
        /**
         * 必须返回JsonObject对象，不可以是字符串
         */
        return JSONObject.fromObject(json.toString());
    }


}