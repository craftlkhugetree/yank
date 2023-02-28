package cn.com.angke.lres.dto;

import java.util.List;

import cn.com.angke.lres.pojo.LresCampus;
import cn.com.angke.lres.pojo.LresLresource;
import cn.com.angke.lres.pojo.LresReadertype;

public class LresourceDto extends LresLresource {
	private List<LresCampus> campuss;
	private List<LresReadertype> readerTypes;

	public List<LresCampus> getCampuss() {
		return campuss;
	}

	public void setCampuss(List<LresCampus> campuss) {
		this.campuss = campuss;
	}

	public List<LresReadertype> getReaderTypes() {
		return readerTypes;
	}

	public void setReaderTypes(List<LresReadertype> readerTypes) {
		this.readerTypes = readerTypes;
	}

	
	
}
