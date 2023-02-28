
CREATE TABLE  Records(
   C_Time		  CHAR(12) PRIMARY KEY,
   Seq		              INT,
   Signature            CHAR(3),       
   FirmwareVersion		  INT,       
   HardwareVersion		  INT,       
   HeaderSize		        INT,             
   VersionTag           CHAR(6),           
   DeviceID		          INT,               
   SamplingRate		      INT, 
   GainSetting		      INT, 
   Resolution		        INT, 
   Noise		            INT,
   PhysicalMinimum		  INT,
   PhysicalMaximum		  INT,
   DigitalMinimum		    INT,
   DigitalMaximum		    INT,
   Prefiltering		      INT,
   TotalSize		        INT,
   UserMode		          INT,               
   RSensitivity		      INT,           
   WSensitivity		      INT,           
   HeartRate		        INT,              
   Tachycardia		
         INT,            
   Bradycardia		      INT,            
   Pause		            INT,                  
   PauseValue		        INT,             
   Rhythm		            INT,                 
   Waveform		          INT,               
   WaveformStable		    INT,         
   EntryPosition		    INT,
   TachycardiaValue		  INT,      
   BradycardiaValue		  INT,       
   MID		              INT,                  
   BPMNoiseFlag		      INT,              
   BPHeartRate		      INT,             
   HighBloodPressure	  INT,   
   LowBloodPressure		  INT,    
   WHOIndicate		      INT,
   DCValue		          INT,
   AnalysisType		      INT,     
   CheckSum             INT,    
   Filename		CHAR(30)   NOT NULL,
   Note                 CHAR(256)
);









