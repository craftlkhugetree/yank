package cn.com.angke.generater;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.beetl.sql.core.ClasspathLoader;
import org.beetl.sql.core.ConnectionSource;
import org.beetl.sql.core.ConnectionSourceHelper;
import org.beetl.sql.core.SQLLoader;
import org.beetl.sql.core.SQLManager;
import org.beetl.sql.core.db.DBStyle;
import org.beetl.sql.core.db.MySqlStyle;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.util.ExcelUtil;

/**   
 * @ClassName:  GenSql   
 * @Description:TODO(pojo与sql自动生成器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:12:33   
 *     
 */  
public class GenSqlBak {
	public static void main(String[] args) throws Exception {	
		String driver = "com.mysql.jdbc.Driver";
		String url = "jdbc:mysql://160.255.0.51:3306/lres2_ysdx";
		String userName = "root";
		String password = "52333181";
		ConnectionSource source = ConnectionSourceHelper.getSimple(driver, url, userName, password);
		DBStyle mysql = new MySqlStyle();
		// sql语句放在classpagth的/sql 目录下
		SQLLoader loader = new ClasspathLoader("/sql");
		// 最后，创建一个SQLManager,DebugInterceptor 不是必须的，但可以通过它查看sql执行情况
		SQLManager sqlManager = new SQLManager(mysql,loader,source);
		//sql.genPojoCodeToConsole("userRole"); 快速生成，显示到控制台
		// 或者直接生成java文件
		String sqlTemplate = "select t2.c_title,t1.q_type,t1.q_cont,t1.q_need,t1.q_answer,\r\n" + 
				"GROUP_CONCAT(IF(t3.qo_iscorrect=1,CONCAT('$T$',t3.qo_option),t3.qo_option) SEPARATOR '||') ops\r\n" + 
				"from question t1\r\n" + 
				"left join classify t2 on SUBSTRING_INDEX(t1.q_class,',',1)=t2.c_id\r\n" + 
				"left join question_option t3 on t1.q_id=t3.q_id\r\n" + 
				"where t1.q_flag = 1\r\n" + 
				"GROUP BY t1.q_id";
		List<JSONObject> list = sqlManager.execute(sqlTemplate, JSONObject.class, new HashMap<>());
		Workbook workbook = new XSSFWorkbook();
		ExcelUtil util = new ExcelUtil(workbook);
		List<List<String>> data = new ArrayList<>();
		//单选
		List<String> title = Arrays.asList(new String[] {"题库","题干","是否必考","题目分析","正确答案","选项A","选项B","选项C","选项D","选项E","选项F"});
		data.add(title);
		list.stream().filter(m->m.getString("q_type").equals("1")).forEach(m->{
			String ops = m.getString("ops");
			String[] opts = ops.split("\\|\\|");
			String trueOpt = "";
			int code = 65;
			for(String opt : opts) {
				if(opt.contains("$T$")) {
					opt = (char)code + "."+opt.replace("$T$", "");
					trueOpt+=","+(char)code;
				}else {
					opt = (char)code + "."+opt;
				}
				m.put((char)code+"", opt);
				code++;
			}
			m.put("trueOpt", trueOpt);
			if(m.getString("q_need").equals("1")) {
				m.put("q_need","是");
			}else {
				m.put("q_need","否");
			}
			String A = m.getString("A") == null ? "":m.getString("A");
			String B = m.getString("B") == null ? "":m.getString("B");
			String C = m.getString("C") == null ? "":m.getString("C");
			String D = m.getString("D") == null ? "":m.getString("D");
			String E = m.getString("E") == null ? "":m.getString("E");
			String F = m.getString("F") == null ? "":m.getString("F");
			List<String> dat = Arrays.asList(new String[] {m.getString("c_title"),m.getString("q_cont"),m.getString("q_need"),"",m.getString("trueOpt").substring(1),A,B,C,D,E,F});
			dat.stream().filter(s->null!=s).collect(Collectors.toList());
			data.add(dat);
		});
		util.write(data, "单选题",true);
		
		//多选
		data.clear();
		List<String> title2 = Arrays.asList(new String[] {"题库","题干","是否必考","题目分析","正确答案","选项A","选项B","选项C","选项D","选项E","选项F"});
		data.add(title2);
		list.stream().filter(m->m.getString("q_type").equals("2")).forEach(m->{
			String ops = m.getString("ops");
			String[] opts = ops.split("\\|\\|");
			String trueOpt = "";
			int code = 65;
			for(String opt : opts) {
				if(opt.contains("$T$")) {
					opt = (char)code + "."+opt.replace("$T$", "");
					trueOpt+=","+(char)code;
				}else {
					opt = (char)code + "."+opt;
				}
				m.put((char)code+"", opt);
				code++;
			}
			m.put("trueOpt", trueOpt);
			if(m.getString("q_need").equals("1")) {
				m.put("q_need","是");
			}else {
				m.put("q_need","否");
			}
			String A = m.getString("A") == null ? "":m.getString("A");
			String B = m.getString("B") == null ? "":m.getString("B");
			String C = m.getString("C") == null ? "":m.getString("C");
			String D = m.getString("D") == null ? "":m.getString("D");
			String E = m.getString("E") == null ? "":m.getString("E");
			String F = m.getString("F") == null ? "":m.getString("F");
			List<String> dat = Arrays.asList(new String[] {m.getString("c_title"),m.getString("q_cont"),m.getString("q_need"),"",m.getString("trueOpt").substring(1),A,B,C,D,E,F});
			dat.stream().filter(s->null!=s).collect(Collectors.toList());
			data.add(dat);
		});
		util.write(data, "多选题",true);
		
		//判断
		data.clear();
		List<String> title3 = Arrays.asList(new String[] {"题库","题干","是否必考","题目分析","是否正确"});
		data.add(title3);
		list.stream().filter(m->m.getString("q_type").equals("3")).forEach(m->{
			if(m.getString("q_need").equals("1")) {
				m.put("q_need","是");
			}else {
				m.put("q_need","否");
			}
			if(null !=m.getString("q_answer") && m.getString("q_answer").equals("T")) {
				m.put("q_answer","是");
			}else{
				m.put("q_answer","否");
			}
			List<String> dat = Arrays.asList(new String[] {m.getString("c_title"),m.getString("q_cont"),m.getString("q_need"),"",m.getString("q_answer")});
			dat.stream().filter(s->null!=s).collect(Collectors.toList());
			data.add(dat);
		});
		util.write(data, "判断题",true);
		File file = new File("E:/question.xlsx");
		OutputStream out = new FileOutputStream(file);
		workbook.write(out);
	}
}
