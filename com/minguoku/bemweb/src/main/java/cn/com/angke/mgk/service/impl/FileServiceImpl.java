package cn.com.angke.mgk.service.impl;

import java.io.Closeable;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.config.service.Config;
import com.somenew.db.DbOpt;
import com.somenew.db.RootDao;
import com.somenew.exception.BusException;
import com.somenew.service.ServiceFactory;
import com.somenew.utils.StringOpt;

import cn.com.angke.mgk.service.FileService;

@Service
public class FileServiceImpl extends RootDao implements FileService {

	static Log logger = LogFactory.getLog(FileServiceImpl.class);

	private void close(Closeable cobj) {
		if (cobj != null) {
			try {
				cobj.close();
			} catch (Throwable e) {
				logger.error("fialed to close io,", e);
			}
		}
	}

	@Override
	public JSONObject saveFile(String filename, InputStream fileinputstream) {
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = vconfig.getConfigValue("UPLOADFILEDIR");
		String UPLOADFILTYPE = vconfig.getConfigValue("UPLOADFILTYPE", "[\"bmp\",\"jpg\",\"jpeg\", \"png\",\"gif\"]");
		System.out.println(filename);
		System.out.println(UPLOADFILTYPE);
		FileOutputStream fos = null;
		try {
			String ext = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
			JSONArray fileTypes = JSONArray.parseArray(UPLOADFILTYPE);
			if (!fileTypes.contains(ext)) {
				throw new BusException("该类型文件不能上传", "不能上传该类型的文件", BusException.TYPE_ERROR, "2");
			}
			String id = StringOpt.produceUUID();
			String xdname = id + "_" + filename;// 输出
			String savePath = UPLOADFILEDIR + "/" + xdname;
			fos = new FileOutputStream(savePath);// 构建输出流
			byte[] buff = new byte[1024];// 缓冲区
			// int len = 0;// 设置缓冲长度
			while (fileinputstream.read(buff) > 0) {// 设置循环语句读取
				fos.write(buff);
			}
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHH:mm:ss");
			fileinputstream.close();
			JSONObject file = new JSONObject();
			//file.put("PHOTOID", id);
			file.put("ID", id);
			file.put("TITLE", filename);
			file.put("FTYPE", ext);
			file.put("FURL", xdname);
			file.put("CREATETIME", sdf.format(new Date()));
			DbOpt.getInstance().insert(null, "CM_FILE", file);
			JSONObject filenouse = new JSONObject();
			filenouse.put("ID", id);
			filenouse.put("NOUSEDT", sdf.format(new Date()));
			DbOpt.getInstance().insert(null, "CM_FILENOUSE", filenouse);
			JSONObject obj = new JSONObject();
			return file;
		} catch (Throwable e1) {
			throw new RuntimeException(e1);
		} finally {
			close(fileinputstream);
			close(fos);
		}
	}

	/**
	 * 获取文件到输出流
	 * 
	 * @param ID
	 * @param outstream
	 */
	private void getFileContent(JSONObject fileObj, OutputStream outstream) {
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = vconfig.getConfigValue("UPLOADFILEDIR");
		FileInputStream fins = null;
		try {
			String filen = UPLOADFILEDIR + fileObj.getString("FURL");
			fins = new FileInputStream(filen);
			byte[] buff = new byte[1024];// 缓冲区
			// int len = 0;// 设置缓冲长度
			while (fins.read(buff) > 0) {// 设置循环语句读取
				outstream.write(buff);
			}
		} catch (Throwable e) {
			throw new RuntimeException(e);
		} finally {
			close(fins);
			close(outstream);
		}

	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public void useFile(String ID, String tableName, String fieldName, String objID) {
		// 增加文件使用关联
		JSONObject fileuse = new JSONObject();
		fileuse.put("FILEID", ID);
		fileuse.put("UTABLE", tableName);
		fileuse.put("UFIELD", fieldName);
		fileuse.put("UTABLEID", objID);
		DbOpt.getInstance().insert(null, "CM_FILEUSE", fileuse);
		// 删除本文件的不在使用记录
		JSONObject filenouse = new JSONObject();
		filenouse.put("ID", ID);
		DbOpt.getInstance().del(null, "CM_FILENOUSE", filenouse, new String[] { "ID" });
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public void delFile(String ID, String tableName, String fieldName, String objID) {
		// 删除使用关系
		JSONObject fileuse = new JSONObject();
		fileuse.put("FILEID", ID);
		fileuse.put("UTABLE", tableName);
		fileuse.put("UFIELD", fieldName);
		fileuse.put("UTABLEID", objID);
		DbOpt.getInstance().del(null, "CM_FILEUSE", fileuse, null);
		// 如果没有使用关系了，则在不用的附件表记录该附件，等待清理
		if (DbOpt.getInstance().getObjByData(null, "CM_FILEUSE", fileuse, new String[] { "FILEID" }, new String[] { "FILEID" }).size() <= 0) {
			JSONObject filenouse = new JSONObject();
			filenouse.put("ID", ID);
			filenouse.put("NOUSEDT", new Date());
			DbOpt.getInstance().insert(null, "CM_FILENOUSE", filenouse);
		}
	}

	@Override
	public void processObjFile(JSONObject data, JSONObject oldData, String tableName, String fieldName, boolean isNew) {
		if (isNew) {// 如果是新对象，则直接记录附件使用关联
			if (!StringUtils.isBlank(data.getString(fieldName))) {
				this.useFile(data.getString(fieldName), tableName, fieldName, data.getString("ID"));
			}
		} else {
			// 如果原对象没有传入并从数据库查询
			if (oldData == null) {
				oldData = DbOpt.getInstance().getObjByID(null, tableName, data.getString("ID"), new String[] { "ID", fieldName });
			}
			// 把对象原来的附件使用关联删除，增加新的邮件使用关联
			if (!StringOpt.strEquals(oldData.getString(fieldName), data.getString(fieldName))) {
				if (!StringUtils.isBlank(oldData.getString(fieldName))) {
					this.delFile(oldData.getString(fieldName), tableName, fieldName, oldData.getString("ID"));
				}
				if (!StringUtils.isBlank(data.getString(fieldName))) {
					this.useFile(data.getString(fieldName), tableName, "HEADPICID", data.getString("ID"));
				}
			}
		}

	}

	@Override
	public void outFileContentToResponse(String ID, HttpServletRequest request, HttpServletResponse response) {
		JSONObject fileObj = DbOpt.getInstance().getObjByID(null, "CM_FILE", ID, null);
		if (fileObj != null) {
			ActionHelp.setReponseFileName(request, response, fileObj.getString("TITLE"));
			ServletOutputStream toClient;
			try {
				toClient = response.getOutputStream();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}// 获取输出流
			this.getFileContent(fileObj, toClient);
		} else {
			throw new BusException("找不到该文件", "找不到该文件" + ID, BusException.TYPE_ERROR, "2");
		}
	}

	@Override
	public JSONObject getFilePath(String ID) {
		JSONObject r = new JSONObject();
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = vconfig.getConfigValue("UPLOADFILEDIR");
		JSONObject fileObj = DbOpt.getInstance().getObjByID(null, "CM_FILE", ID, null);
		r.put("FILEDIR", UPLOADFILEDIR);
		r.put("FILENAME", fileObj.getString("FURL"));
		r.put("FILETITLE", fileObj.getString("TITLE"));
		return r;
	}

}
