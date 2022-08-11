package cn.com.angke.utils;

import java.util.Arrays;

/**
 * 分页类
 * @author YiT
 *
 */
public class ArrayPage {
	 /**总的结果集*/
    private Object[] result = new Object[]{};
    /**实际显示的结果集*/
    private Object[] displayResult = new Object[]{};
    /**起始查询索引*/
    private int start;
    /**每页显示多少*/
    private int pageSize = 2;
    /**是否是最后一页*/
    private boolean isLastPage;
    /**最后一页起始索引*/
    private int lastPageStart;
     
    public ArrayPage() {
    }
     
    public ArrayPage(Object[] result) {
        this.result = result;
    }
     
    public ArrayPage(Object[] result, int start, int pageSize) {
        this(result);
        this.start = start;
        this.pageSize = pageSize;
    }
     
    public Object[] getResult() {
        return result;
    }
 
    public void setResult(Object[] result) {
        this.result = result;
    }
 
    /**
     * 获取当前起始索引(默认从0开始)
     * @return
     */
    public int getStart() {
        return start;
    }
 
    /**
     * 设置起始索引值
     * @param start
     */
    public void setStart(int start) {
        this.start = start;
    }
 
    /**
     * 获取每页显示大小
     * @return
     */
    public int getPageSize() {
        return pageSize;
    }
     
    /**
     * 设置每页显示条数
     * @param pageSize
     */
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
 
    /**
     * 获取当前页号
     * @return
     */
    public int getPageNo() {
        return (this.start / this.pageSize) + 1;
    }
 
    /**
     * 获取总页数
     * @return
     */
    public int getPageTotalNo() {
        return this.getTotalCount() % this.pageSize == 0 ? this.getTotalCount() / this.pageSize : this.getTotalCount() / this.pageSize + 1;
    }
 
    /**
     * 获取总条数
     * @return
     */
    public int getTotalCount() {
        return this.getResult().length;
    }
     
    /**
     * 判断是否是最后一页
     * @return
     */
    public boolean getIsLastPage() {
        int expectedSize = this.getPageNo() * this.pageSize;
        this.isLastPage = expectedSize >= this.getTotalCount() && expectedSize - this.pageSize <= this.getTotalCount() ;
        return this.isLastPage;
    }
     
    /**
     * 判断是否是第一页
     * @return
     */
    public boolean getIsFirstPage() {
         
        return this.getPageNo() == 1;
    }
     
    /**
     * 获取上一页起始索引
     * @return
     */
    public int getPreviousPageStart() {
        return this.start - this.pageSize;
    }
     
    /**
     * 获取下一页起始索引
     */
    public int getNextPageStart() {
        return this.start + this.pageSize;
    }
     
    /**
     * 获取最后一页起始索引
     */
    public int getLastPageStart() {
        this.lastPageStart = (this.getPageTotalNo() - 1) * this.pageSize;
        return this.lastPageStart;
    }
 
    /**
     * 获取实际需要显示的结果集
     * @return
     */
    public Object[] getDisplayResult() {
        Object[] t = new Object[10];
        if(getIsLastPage()) {
            int expectedSize = this.getPageNo() * this.pageSize;
            t = new Object[this.getPageSize() - (expectedSize - this.getTotalCount())];
        } else {
            t = new Object[this.pageSize];
        }
        System.arraycopy(this.getResult(), this.start, t, 0, t.length);
        this.displayResult = t;
        return displayResult;
    }
     
    public static void main(String[] args) {
        Object[] strs = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"};
        ArrayPage page = new ArrayPage(strs, 0, 12);
        System.out.println(Arrays.asList(page.getDisplayResult()));
        System.out.println("总条数:" + page.getTotalCount());
        System.out.println("当前第:" + page.getPageNo() + "页");
        System.out.println("总页数:" + page.getPageTotalNo());
        System.out.println("是否为最后一页:" + page.getIsLastPage());
    }
}
