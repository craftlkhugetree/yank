package cn.com.angke.book.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.com.angke.util.cache.ConsumerBooksCache;

@RestController
@RequestMapping("Data")
public class Data {
	
	@GetMapping("getConsumerBooks")
	public String getConsumerBooks (@RequestParam("customerId") String customerId) {
		return ConsumerBooksCache.getConsumerBooks(customerId);
	}
	
	@GetMapping("forceUpdate")
	public String forceUpdate (@RequestParam("customerId") String customerId) {
		return ConsumerBooksCache.forceUpdate(customerId);
	}
	
	@GetMapping("clearCache")
	public String clearCache (@RequestParam("customerId") String customerId) {
		return ConsumerBooksCache.clearCache(customerId);
	}
	
	
}
