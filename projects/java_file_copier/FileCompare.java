import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Scanner;
import java.util.ArrayList;

public class FileCompare
{
  public static void main(String[] args)
    throws IOException, NoSuchAlgorithmException
  {
    Scanner scnr = new Scanner(System.in);
    String searchStr, targetStr, method;
    File searchDir, targetDir;

    HashMap mappedFiles = new HashMap<String, File>();
    ArrayList<File> duplicates = new ArrayList<File>();
    MessageDigest mdigest = MessageDigest.getInstance("MD5");

    // Ask for source directory for searching
    do
    {
      System.out.print("Search Directory: ");
      searchStr = scnr.nextLine();

      searchDir = new File(searchStr);
    
      System.out.println((searchDir.exists() && searchDir.isDirectory())? "" : "Path does not exist or is not a directory\n");
    } while(!(searchDir.exists() && searchDir.isDirectory()));

    // Ask for target directory to copy to
    do
    {
      System.out.print("Trash Directory: ");
      targetStr = scnr.nextLine();

      targetDir = new File(targetStr);
    
      System.out.println((targetDir.exists() && targetDir.isDirectory())? "" : "Path does not exist or is not a directory\n");
    } while(!(targetDir.exists() && targetDir.isDirectory()));

//    System.out.print("Search Method [A: Checksum] [B: Byte-by-Byte]: ");
//    method = scnr.nextLine();

/*    switch(method)
    {
      case "A":
	duplicates = checkByChecksum(mdigest, mappedFiles, searchDir);
	break;

      case "B":
	File a = new File("test/20230429_125646.jpg");
	File b = new File("test/1000001844.jpg");

	System.out.println("\nMismatch: " + Files.mismatch(a.toPath(), b.toPath()));
	break;
    }
*/

    duplicates = checkByChecksum(mdigest, mappedFiles, searchDir);
    System.out.println("\nFound " + duplicates.size() + " duplicates in " + searchDir.getAbsolutePath());

    if(duplicates.size() > 0)
    {
      System.out.println("Moving duplicates to " + targetDir.getAbsolutePath() + "...");
      for(File f : duplicates)
      {
        Files.move(f.toPath(), targetDir.toPath().resolve(f.getName()));
      }
    }
  }

  public static String getChecksum(MessageDigest mdigest, File file)
    throws IOException
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
    throws IOException
  {
    ArrayList<File> duplicates = new ArrayList<File>();

    System.out.println("Searching for duplicates in " + searchDir.getAbsolutePath());
    File[] files = searchDir.listFiles();

    for(File f : files)
    {
      String hash = getChecksum(mdigest, f);

      if(!mappedFiles.containsKey(hash))
      {
	mappedFiles.put(hash, f);
      } else
      {
	System.out.println(f + " contains duplicate data to " + mappedFiles.get(hash));
	duplicates.add(f);
      }
    }

    return duplicates;
  }

}
