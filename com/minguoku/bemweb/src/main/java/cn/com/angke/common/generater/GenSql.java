package cn.com.angke.common.generater;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import org.beetl.core.Configuration;
import org.beetl.core.GroupTemplate;
import org.beetl.core.Template;
import org.beetl.core.resource.ClasspathResourceLoader;
import org.beetl.sql.core.ConnectionSource;
import org.beetl.sql.core.ConnectionSourceHelper;
import org.beetl.sql.core.SQLManager;
import org.beetl.sql.core.SQLReady;
import org.beetl.sql.core.db.DBStyle;
import org.beetl.sql.core.db.MySqlStyle;
import org.beetl.sql.core.kit.GenKit;
import org.beetl.sql.ext.gen.SourceGen;

import com.alibaba.fastjson.JSONObject;

import cn.hutool.core.util.StrUtil;

/**   
 * @ClassName:  GenSql   
 * @Description:TODO(pojo与sql自动生成器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:12:33   
 *     
 */  
public class GenSql {
	private final static String driver = "com.mysql.jdbc.Driver";
	private final static String url = "jdbc:mysql://160.255.0.67:3306/mgkLocal";
	private final static String userName = "root";
	private final static String password = "d52333181";
	
	public static void main(String[] args) throws Exception {	
		String context = "app";
		String database = "mgkLocal";
		String table = "wxk_notice";
		int idType = 1;//1自增2自定义3雪花算法
		int type = 1;//1生成全部2只生成entity
		GenSql.genCode(context,database,table,idType,type);
	}
	
	public static SQLManager getDatasource(String driver,String url,String userName,String password) {
		ConnectionSource source = ConnectionSourceHelper.getSimple(driver, url, userName, password);
		DBStyle mysql = new MySqlStyle();
		SQLManager sqlManager = new SQLManager(mysql,source);
		return sqlManager;
	}
	
	public static void genEntity(String database,String table,String context,Integer idType) throws IOException {
		String idStr = "@AutoID";
		if(idType.intValue() == 2) {
			idStr = "@AssignID";
		}
		if(idType.intValue() == 3) {
			idStr = "@AssignID(\"simple\")";
		}
		String className = StrUtil.upperFirst(StrUtil.toCamelCase(table));
		String pkg = "cn.com.angke."+context+".entity";
		SQLManager sqlManager = GenSql.getDatasource(driver, url, userName, password);
		String sql = "select a.COLUMN_NAME name,a.COLUMN_COMMENT comment,a.DATA_TYPE datatype,b.table_name tablename," + 
				"	IFNULL(b.table_comment,'') tablecomment"
				+ " from INFORMATION_SCHEMA.Columns a"
				+ " INNER JOIN INFORMATION_SCHEMA.TABLES b ON a.table_name = b.table_name "
				+ " where a.table_name='"+table+"' and a.table_schema = '"+database+"'"
				+ " and b.table_name='"+table+"' and b.table_schema = '"+database+"'";
		SQLReady sqlr = new SQLReady(sql);
		List<JSONObject> attrs = sqlManager.execute(sqlr, JSONObject.class);
		String tablecomment = "";
		for(JSONObject m : attrs) {
			tablecomment = m.getString("tablecomment");
			m.put("name", StrUtil.toCamelCase(m.getString("name")));
			String datetype = m.getString("datatype");
			switch (datetype) {
			case "bigint":
				m.put("type","Long");
				break;
			case "int":
				m.put("type","Integer");
				break;
			case "smallint":
				m.put("type","Integer");
				break;
			case "date":
				m.put("type","Date");
				break;
			case "datetime":
				m.put("type","Date");
				break;
			case "decimal":
				m.put("type","BigDecimal");
				break;
			default:
				m.put("type","String");
				break;
			}
		}
		String srcPath = GenKit.getJavaSRCPath();
		ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("cn/com/angke/common/generater/");
		Configuration cfg = Configuration.defaultConfiguration();
		GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);
		Template template = gt.getTemplate("/entity.btl");
		template.binding("className", className);
		template.binding("table", table);
		template.binding("tablecomment", tablecomment);
		template.binding("attrs", attrs);
		template.binding("package", "cn.com.angke."+context+".entity");
		template.binding("context", context);
		template.binding("idStr", idStr);
		String code = template.render();
		SourceGen.saveSourceFile(srcPath,pkg,className,code);
	}
	
	public static void genSQL(String table) throws Exception {
		String filename = StrUtil.upperFirst(StrUtil.toCamelCase(table));
		String target = GenKit.getJavaResourcePath() + "/sql/" + filename + ".md";
        FileWriter writer = new FileWriter(new File(target));
        ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("cn/com/angke/common/generater/");
		Configuration cfg = Configuration.defaultConfiguration();
		GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);
		Template template = gt.getTemplate("sql.btl");
		template.binding("tableName", table);
		template.renderTo(writer);
        writer.close();
	}
	
	public static void genService(String table,String context) throws IOException {
		String entity = StrUtil.upperFirst(StrUtil.toCamelCase(table));
		String lowerentity = StrUtil.toCamelCase(table);
		String pkg = "cn.com.angke."+context+".service";
		String serviceName = entity+"Service";
		String srcPath = GenKit.getJavaSRCPath();
		ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("cn/com/angke/common/generater/");
		Configuration cfg = Configuration.defaultConfiguration();
		GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);
		Template template = gt.getTemplate("/service.btl");
		template.binding("className", serviceName);
		template.binding("entity", entity);
		template.binding("lowerentity", lowerentity);
		template.binding("package", pkg);
		template.binding("context", context);
		String code = template.render();
		SourceGen.saveSourceFile(srcPath,pkg,serviceName,code);
	}
	
	public static void genServiceImpl(String table,String context) throws IOException {
		String entity = StrUtil.upperFirst(StrUtil.toCamelCase(table));
		String lowerentity = StrUtil.toCamelCase(table);
		String pkg = "cn.com.angke."+context+".service.impl";
		String serviceImplName = entity+"ServiceImpl";
		String srcPath = GenKit.getJavaSRCPath();
		ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("cn/com/angke/common/generater/");
		Configuration cfg = Configuration.defaultConfiguration();
		GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);
		Template template = gt.getTemplate("/serviceimpl.btl");
		template.binding("className", serviceImplName);
		template.binding("entity", entity);
		template.binding("lowerentity", lowerentity);
		template.binding("package", pkg);
		template.binding("context", context);
		String code = template.render();
		SourceGen.saveSourceFile(srcPath,pkg,serviceImplName,code);
	}
	
	public static void genController(String table,String context) throws IOException {
		String entity = StrUtil.upperFirst(StrUtil.toCamelCase(table));
		String lowerentity = StrUtil.toCamelCase(table);
		String pkg = "cn.com.angke."+context+".controller";
		String controllerName = entity+"Controller";
		String srcPath = GenKit.getJavaSRCPath();
		ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("cn/com/angke/common/generater/");
		Configuration cfg = Configuration.defaultConfiguration();
		GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);
		Template template = gt.getTemplate("/controller.btl");
		template.binding("className", controllerName);
		template.binding("entity", entity);
		template.binding("lowerentity", lowerentity);
		template.binding("package", pkg);
		template.binding("context", context);
		String code = template.render();
		SourceGen.saveSourceFile(srcPath,pkg,controllerName,code);
	}
	
	public static void genCode(String context,String database,String table,int idType,int type) throws Exception{
		if(type == 1) {
			GenSql.genEntity(database,table, context,idType);
			GenSql.genSQL(table);
			GenSql.genService(table, context);
			GenSql.genServiceImpl(table, context);
			GenSql.genController(table, context);
		}else {
			GenSql.genEntity(database,table, context,idType);
		}
	}
	
}
