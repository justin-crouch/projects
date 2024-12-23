import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Scanner;
import java.util.ArrayList;

public class Compare
{
  public static final String ERROR = ANSI.color("ERROR:", ANSI.BG_RED) + " ";

  public static void moveDuplicates(Scanner scnr, File searchDir, File targetDir)
  {
    HashMap mappedFiles = new HashMap<String, File>();
    ArrayList<File> duplicates = new ArrayList<File>();
    MessageDigest mdigest;

    try
    {
      mdigest = MessageDigest.getInstance("MD5");
    } catch(NoSuchAlgorithmException e)
    {
      System.out.println(ERROR + ANSI.color("MD5 algorithm not supported.", ANSI.RED));
      return;
    }

    duplicates = checkByChecksum(mdigest, mappedFiles, searchDir);
    System.out.println("\nFound " + duplicates.size() + " duplicates in " + searchDir.getAbsolutePath());

    if(duplicates.size() > 0)
    {
      System.out.println("Moving duplicates to " + targetDir.getAbsolutePath() + "...");
      for(File f : duplicates)
      {
	try
	{
	  Files.move(f.toPath(), targetDir.toPath().resolve(f.getName()));
	} catch(FileAlreadyExistsException e)
	{
	  System.out.println(ERROR + ANSI.color("File '" + f.getName() + "' already exists in '" + targetDir.getAbsolutePath(), ANSI.RED));
	} catch(IOException e)
	{
	  System.out.println(ERROR + ANSI.color("Issue when moving file '" + f.getAbsolutePath() + "'", ANSI.RED));
	}
      }
    }

    System.out.println(ANSI.color("Moving Complete!", ANSI.GREEN));
  }

  public static String getChecksum(MessageDigest mdigest, File file)
    throws FileNotFoundException, IOException
  {
    FileInputStream fis = new FileInputStream(file);

    byte[] byteArray = new byte[1024];
    int bytesCount = 0;

    while((bytesCount = fis.read(byteArray)) != -1)
    {
      mdigest.update(byteArray, 0, bytesCount);
    }
    fis.close();

    byte[] bytes = mdigest.digest();
    StringBuilder sb = new StringBuilder();
    
    for(int i=0; i<bytes.length; i++)
    {
      sb.append( Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1) );
    }

    return sb.toString();
  }

  public static ArrayList<File> checkByChecksum(MessageDigest mdigest, HashMap<String, File> mappedFiles, File searchDir)
  {
    ArrayList<File> duplicates = new ArrayList<File>();

    System.out.println(ANSI.color("\nSearching for duplicates in " + searchDir.getAbsolutePath(), ANSI.CYAN));
    File[] files = searchDir.listFiles();
    String hash;

    for(File f : files)
    {
      try
      {
	hash = getChecksum(mdigest, f);
      } catch(FileNotFoundException e)
      {
	System.out.println(ERROR + ANSI.color("File '" + f.getAbsolutePath() + "' not found. Could not obtain MD5 checksum", ANSI.RED));
	continue;
      } catch(IOException e)
      {
	System.out.println(ERROR + ANSI.color("IO error with file '" + f.getAbsolutePath() + "'", ANSI.RED));
	continue;
      }

      if(!mappedFiles.containsKey(hash))
      {
	mappedFiles.put(hash, f);
      } else
      {
	System.out.println(
	  ANSI.color("DUPLICATE:", ANSI.BG_CYAN) + " " +
	  ANSI.color(f + " => " + mappedFiles.get(hash), ANSI.CYAN)
	);
	duplicates.add(f);
      }
    }

    return duplicates;
  }


}
