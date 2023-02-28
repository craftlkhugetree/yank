package cn.com.angke.generater;

import org.beetl.sql.core.ClasspathLoader;
import org.beetl.sql.core.ConnectionSource;
import org.beetl.sql.core.ConnectionSourceHelper;
import org.beetl.sql.core.Interceptor;
import org.beetl.sql.core.SQLLoader;
import org.beetl.sql.core.SQLManager;
import org.beetl.sql.core.UnderlinedNameConversion;
import org.beetl.sql.core.db.DBStyle;
import org.beetl.sql.core.db.MySqlStyle;
import org.beetl.sql.ext.DebugInterceptor;
import org.beetl.sql.ext.gen.GenConfig;

/**   
 * @ClassName:  GenSql   
 * @Description:TODO(pojo与sql自动生成器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:12:33   
 *     
 */  
public class GenSql {
	public static void main(String[] args) throws Exception {	
		String driver = "com.mysql.jdbc.Driver";
		String url = "jdbc:mysql://160.255.0.67:3306/lres_nhdz";
		String userName = "root";
		String password = "d52333181";
		ConnectionSource source = ConnectionSourceHelper.getSimple(driver, url, userName, password);
		DBStyle mysql = new MySqlStyle();
		// sql语句放在classpagth的/sql 目录下
		SQLLoader loader = new ClasspathLoader("/sql");
		// 数据库命名跟java命名一样，所以采用DefaultNameConversion，还有一个是UnderlinedNameConversion，下划线风格的，
		UnderlinedNameConversion nc = new  UnderlinedNameConversion();
		// 最后，创建一个SQLManager,DebugInterceptor 不是必须的，但可以通过它查看sql执行情况
		SQLManager sqlManager = new SQLManager(mysql,loader,source,nc,new Interceptor[]{new DebugInterceptor()});
		//sql.genPojoCodeToConsole("userRole"); 快速生成，显示到控制台
		// 或者直接生成java文件
		GenConfig config = new GenConfig();
		config.preferBigDecimal(true);
		sqlManager.genPojoCode("LRES_CONFIG","cn.com.angke.lres.pojo",config);
//		sqlManager.genSQLFile("R_QRES_CLASS", config);
	}
}
