import java.util.Scanner;
import java.io.File;
import java.nio.file.Files;

public class ImageBackup
{
  public static void searchAndCopy(File srcDirectory, File tarDirectory, String extension)
  {
    // Find all files with specifc extension
    File[] filesChildren = srcDirectory.listFiles((dir, name) -> name.endsWith("." + extension));
    for(File child : filesChildren)
    {
      System.out.println("Found File: " + child.getAbsolutePath());
      try
      {
	Files.copy(child.toPath(), tarDirectory.toPath().resolve(child.getName()));
      } catch(Exception e)
      {
	System.out.println(e);
      }
    }
    System.out.print((filesChildren.length==0)? ("No Files Of ." + extension + " Found In " + srcDirectory.toPath() + "\n") : "");

    // Find all subdirectories
    File[] dirsChildren = srcDirectory.listFiles((f) -> f.isDirectory());
    for(File child : dirsChildren)
    {
//      System.out.println(child);
      searchAndCopy(child, tarDirectory, extension);
    }
  }

  public static void main(String[] args)
  {
    Scanner scnr = new Scanner(System.in);
    String searchStr;
    String targetStr;
    String extension;
    File rootDir;
    File targetDir;

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

    searchAndCopy(rootDir, targetDir, extension);
  }
}
