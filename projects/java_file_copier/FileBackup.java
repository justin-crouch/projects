import java.util.Scanner;
import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;

public class FileBackup
{
  public static void search(File srcDirectory, String extension, ArrayList<File> fileList)
  {
    // Find all files with specifc extension
    File[] filesChildren = srcDirectory.listFiles((dir, name) -> name.endsWith("." + extension));
    for(File child : filesChildren)
    {
      System.out.println("Found File: " + child.getAbsolutePath());
      fileList.add(child);
    }
    System.out.print((filesChildren.length==0)? ("No Files Of ." + extension + " Found In " + srcDirectory.toPath() + "\n") : "");

    // Find all subdirectories
    File[] dirsChildren = srcDirectory.listFiles((f) -> f.isDirectory());
    for(File child : dirsChildren)
    {
//      System.out.println(child);
      search(child, extension, fileList);
    }
  }

  public static void copy(ArrayList<File> fileList, File tarDirectory)
  {
    int filesAmount = fileList.size();
    int filesCopied = 0;
    int filesFailed = 0;

    for(File child : fileList){
      try
      {
	Files.copy(child.toPath(), tarDirectory.toPath().resolve(child.getName()));
	filesCopied += 1;
      } catch(Exception e)
      {
	System.out.println(e);
	filesFailed += 1;
      }
      
      System.out.println("Progress: " + (filesCopied+filesFailed) + "/" + filesAmount + "(" + Math.ceil((double)(filesCopied+filesFailed)/filesAmount*100) + ")");
    }
    
    System.out.println("\nCopy Complete!\tSuccessful: " + filesCopied + "\tFailed: " + filesFailed);
  }

  public static void main(String[] args)
  {
    Scanner scnr = new Scanner(System.in);
    String searchStr;
    String targetStr;
    String extension;
    File rootDir;
    File targetDir;
    ArrayList<File> fileList = new ArrayList<File>();

    // Ask for source directory for searching
    do
    {
      System.out.print("Search Directory: ");
      searchStr = scnr.nextLine();

      rootDir = new File(searchStr);
    
      System.out.println((rootDir.exists() && rootDir.isDirectory())? "" : "Path does not exist or is not a directory\n");
    } while(!(rootDir.exists() && rootDir.isDirectory()));

    // Ask for target directory to copy to
    do
    {
      System.out.print("Target Directory: ");
      targetStr = scnr.nextLine();

      targetDir = new File(targetStr);
    
      System.out.println((targetDir.exists() && targetDir.isDirectory())? "" : "Path does not exist or is not a directory\n");
    } while(!(targetDir.exists() && targetDir.isDirectory()));

    System.out.print("Extension: ");
    extension = scnr.nextLine();

    search(rootDir, extension, fileList);

    System.out.println("\n\nFound: " + Integer.toString(fileList.size()) + " files with " + extension + " extension[s].");

    copy(fileList, targetDir);
  }
}
