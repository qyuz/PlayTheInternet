// This file doesn't know about Jetty but does know about servlet requests and response.
// This file could be used with servers other than Jetty by changing the caller Java app to this file.
// 
// This file is the only Java file that knows about the JavaScript files of the server-side app being deployed
// 
// This file is the glue that joins the whole system together (servlet, Rhino JavaScript shell, JavaScript files).
//     This file converts Java servlet request object to a JavaScript object.
//     These JavaScript objects are processed in the JavaScript app (interact with database etc).
//     The JavaScript app populates a JavaScript object as the response
//     This file then converts this JavaScript response into the Java servlet response object.

package claypool.server;

import java.io.*;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.mozilla.javascript.*;


public class RequestHandler
{
    static Logger logger = Logger.getLogger("claypool.server.RequestHandler");
    private Shell shell;
    private String dispatchMethod;
    private ServletContext servletContext;
    public RequestHandler(  Shell shell, String dispatchMethod, ServletContext servletContext){
        this.shell          = shell;
        this.dispatchMethod  = dispatchMethod;  
        this.servletContext = servletContext;          
    }

    public boolean processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
    	try{
	        
	        // ---------------------------------------------------------------------
	        // prepare JavaScript request object from the Java request object and
	        // create an empty response object that the JavaScript web framework and web app
	        // will populate. You could send the Java request and response objects
	        // to the JavaScript since Rhino allows mixing Java objects directly in 
	        // the JavaScript; however, I want to have only JavaScript in the JavaScript.
	        // This way the JavaScript could be ported to run on the Spidermonkey or some
	        // other JavaScript engine more easily.
	        //
	        // (A complication arises at this point if you want to have file uploads
	        // with multipart HTML forms. See Apache Commons project for Java code
	        // to attack the file upload problem.)
	        // ---------------------------------------------------------------------
	
	        logger.debug("processing request: " + request);
	        // Create the JavaScript request object
	        Scriptable req = shell.getContext().newObject(shell);
	
	        ScriptableObject.defineProperty(req, "authType",            request.getAuthType(), 0);// note zero means no attributes
	        
	        Scriptable attributes = shell.getContext().newObject(shell);
	        ScriptableObject.defineProperty(req, "attributes",          attributes, 0);
	        Enumeration attrNames = request.getAttributeNames();
	        while(attrNames.hasMoreElements()) {
	          String attrName = (String)attrNames.nextElement();
	          ScriptableObject.defineProperty(attributes, attrName,     request.getAttribute(attrName), 0);
	        }
	        
	        BufferedReader in = null;
	        try{
	            if(request.getContentLength()>0 && !request.getContentType().startsWith("application/x-www-form-urlencoded")){
	                String inputString = "";
	                String input = "";
	                    in = request.getReader();
	                    input = in.readLine();
	                    while(input != null){
	                        logger.debug(input);
	                        inputString = inputString + input;
	                        input = in.readLine();
	                    }
	                ScriptableObject.defineProperty(req, "body",             inputString, 0);
	            }else{
	                ScriptableObject.defineProperty(req, "body",             "", 0);
	            }
	        }catch(Exception e){
	            logger.error("Failed to read request body.", e);
	        }finally{
	            try{in.close();}catch(Exception ignore){}
	        }
	        ScriptableObject.defineProperty(req, "characterEncoding",   request.getCharacterEncoding(), 0);
	        ScriptableObject.defineProperty(req, "contentLength",       request.getContentLength(), 0);
	        ScriptableObject.defineProperty(req, "contentType",         request.getContentType(), 0);
	        ScriptableObject.defineProperty(req, "contextPath",         request.getContextPath(), 0);
	        ScriptableObject.defineProperty(req, "cookies",             request.getCookies(), 0);
	        
	        Scriptable requestHeaders = shell.getContext().newObject(shell);
	        ScriptableObject.defineProperty(req, "headers", requestHeaders, 0);
	        Enumeration requestHeaderNames = request.getHeaderNames();
	        while(requestHeaderNames.hasMoreElements()) {
	          String headerName = (String)requestHeaderNames.nextElement();
	          ScriptableObject.defineProperty(requestHeaders, headerName, request.getHeader(headerName).toString(), 0);
	        }
	        
	        ScriptableObject.defineProperty(req, "locale", request.getLocale().toString(), 0);
	        Scriptable locales = shell.getContext().newObject(shell);
	        ScriptableObject.defineProperty(req, "locales", locales, 0);
	        Enumeration localeNames = request.getLocales();
	        int preferenceLevel = 0;
	        while(localeNames.hasMoreElements()) {
	          String localeName = (String)localeNames.nextElement().toString();
	          ScriptableObject.defineProperty(locales, localeName,      preferenceLevel++, 0);
	        }
	        
	        ScriptableObject.defineProperty(req, "method",              request.getMethod(), 0);
	        
	        Scriptable parameters = shell.getContext().newObject(shell);
	        ScriptableObject.defineProperty(req, "parameters", parameters, 0);
	        Enumeration paramNames = request.getParameterNames();
	        while(paramNames.hasMoreElements()) {
	          String paramName = (String)paramNames.nextElement();
	          // NOTE use getParameterValues() if could be more than one of the parameter with the same name.
	          String[] values = request.getParameterValues(paramName);
	          if(values.length > 1){
	        	  Scriptable array = shell.getContext().newArray(shell, values.length);
	        	  for(int i=0;i<values.length;i++){
	        		  array.put(i, array, values[i]);
	        	  }
	        	  ScriptableObject.defineProperty(
        			  parameters, 
        			  paramName,  
        			  array, 
        			  0
	        	  );
	          }else{
	        	  String paramValue = request.getParameter(paramName);
	        	  logger.debug("parameter -> "+paramName+" : "+paramValue);
	        	  ScriptableObject.defineProperty(
	        	      parameters, 
	        	      paramName,  
	        	      paramValue != null ? paramValue : "", 
	        	      0
	        	  );
	          }
	        }
	        
	        ScriptableObject.defineProperty(req, "pathInfo",            request.getPathInfo(), 0);
	        ScriptableObject.defineProperty(req, "pathTranslated",      request.getPathTranslated(), 0);
	        ScriptableObject.defineProperty(req, "protocol",            request.getProtocol(), 0);
	        ScriptableObject.defineProperty(req, "queryString",         request.getQueryString(), 0);
	        ScriptableObject.defineProperty(req, "remoteAddr",          request.getRemoteAddr(), 0);
	        ScriptableObject.defineProperty(req, "remoteHost",          request.getRemoteHost(), 0);
	        ScriptableObject.defineProperty(req, "remoteUser",          request.getRemoteUser(), 0);
	        ScriptableObject.defineProperty(req, "requestedSessionId",  request.getRequestedSessionId(), 0);
	        ScriptableObject.defineProperty(req, "requestURI",          request.getRequestURI(), 0);
	        ScriptableObject.defineProperty(req, "requestURL",          request.getRequestURL().toString(), 0);
	        ScriptableObject.defineProperty(req, "serverName",          request.getServerName(), 0);
	        ScriptableObject.defineProperty(req, "serverPort",          request.getServerPort(), 0);
	        ScriptableObject.defineProperty(req, "servletPath",         request.getServletPath(), 0);
	        
	        //user principle properties
	        if( request.getUserPrincipal() == null){
		        ScriptableObject.defineProperty(req, "userPrincipal",  null, 0);
	        }else{
		        ScriptableObject.defineProperty(req, "userPrincipal",  request.getUserPrincipal().getName(), 0);
	        }
	        
	        //TODO add session object and it's properties
	        
	        // Create the empty JavaScript response object
	        Scriptable res = shell.getContext().newObject(shell);
	
	        // ---------------------------------------------------------------------
	        // STEP 2: call the web framework to use the request and generate the response
	        // The framework *must* build some kind of response even if just an error message.
	        // ---------------------------------------------------------------------
	
	        // dispatchMethod is the single global entry function of the JavaScript web app 
	        logger.debug("Handing request/response to javascript.");
	        Object[] args = {req, res};
	        shell.callGlobalFunction(dispatchMethod, args);
	
	        // ---------------------------------------------------------------------
	        // STEP 3: take properties from the JavaScript response object
	        // and add them to the Java response object
	        // ---------------------------------------------------------------------
	
	        logger.debug("Reading response from javascript.");
	        Scriptable responseHeaders = null;
	        try{
	        	responseHeaders = Context.toObject(
	            	ScriptableObject.getProperty(res, "headers"), shell);
	        }catch(Exception e){
	        	logger.error("Error reading response headers", e);
	        }
	        
	        logger.debug("Headers." + responseHeaders.toString());
	        
	        Double status = Context.toNumber(
	            ScriptableObject.getProperty(responseHeaders, "status"));
	        if(status == null){ logger.warn("Status should never be null."); }
	        if(status!=null && status.intValue() == 404){
	            logger.debug("Redirect to static resource");
	            return false;
	        }
	        response.setStatus(status.intValue());
	        logger.debug("status: " + status);
	        Object[] responseHeadersFields = ScriptableObject.getPropertyIds(responseHeaders);
	        logger.debug("Raw Response fields: " +responseHeadersFields);
	        logger.debug("Raw Response fields length: " +responseHeadersFields.length);
	        int contentLength = -1;
	        String contentType = "text/html";
	        //TODO: Why the heck 1!!!
	        for(int i = 0; i < responseHeadersFields.length; i++){
	        	try{
		            String responseHeaderValue =  Context.toString(
		                ScriptableObject.getProperty(
		                    responseHeaders, 
		                    responseHeadersFields[i].toString()
		                ) 
		            );
		            logger.debug("Adding Header: " + responseHeadersFields[i] );
		            logger.debug("Header Value: " + responseHeaderValue );
		            if(!responseHeadersFields[i].toString().equalsIgnoreCase("")){
		                if(responseHeadersFields[i].toString().equalsIgnoreCase("Content-Length")){
		                    logger.debug("contentLength : " + responseHeaderValue);
		                    contentLength = Integer.parseInt(responseHeaderValue.replace(" ",""));
		                    response.setContentLength(contentLength);
		                }else if(responseHeadersFields[i].toString().equalsIgnoreCase("Content-Type")){
		                    logger.debug("contentType : " + responseHeaderValue);
		                    contentType = responseHeaderValue;
		                    response.setContentType(contentType);
		                }else{
		                response.addHeader(
		                    responseHeadersFields[i].toString(),
		                    Context.toString(
		                        ScriptableObject.getProperty(
		                            responseHeaders, 
		                            responseHeadersFields[i].toString())
		                    ));
		                }
		            }
	        	}catch(Exception e){
	        		logger.debug(e);
	        	}
	        }
	        if(contentType.indexOf("image") > -1){
	            byte[] body = (byte[])Context.toType(
	                ScriptableObject.getProperty(res, "body"),
	                byte[].class
	            );
	            response.getOutputStream().write(body);
	        }else{
	            String body = Context.toString(
	                ScriptableObject.getProperty(res, "body")
	            );
	            //if(! (contentLength > -1) ){
	                contentLength = body.getBytes("UTF-8").length;
	            //}
                response.setContentLength(contentLength);
                logger.debug("Actual Body Length ===> " + contentLength);
                response.getWriter().println(body);
				logger.debug("Response Body : " + body);
	        }	
        }catch(Exception e){
            logger.error(e);
        	response.setStatus(500);
            response.setContentLength(e.toString().length());
            response.getWriter().println(e.toString());
        }finally{
        	return true;
        }
    }
    
}
