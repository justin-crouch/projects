import java.util.Scanner;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.FileAlreadyExistsException;
import java.util.ArrayList;

public class Backup
{
  public static final String ERROR = ANSI.color("ERROR:", ANSI.BG_RED) + " ";

  public static void search(File srcDirectory, String[] extensions, ArrayList<File> fileList)
  {
    // Find all files with specifc extensions
    for(String extension : extensions)
    {
      File[] filesChildren = srcDirectory.listFiles((dir, name) -> name.endsWith("." + extension));
      for(File child : filesChildren)
      {
	System.out.println(ANSI.color("FOUND FILE:", ANSI.BG_GREEN) + " " + child.getAbsolutePath());
	fileList.add(child);
      }
      System.out.print((filesChildren.length==0)? ANSI.color("No Files Of ." + extension + " Found In " + srcDirectory.toPath() + "\n", ANSI.RED) : "");
    }

    // Find all subdirectories
    File[] dirsChildren = srcDirectory.listFiles((f) -> f.isDirectory());
    for(File child : dirsChildren)
    {
      search(child, extensions, fileList);
    }
  }

  public static void copy(ArrayList<File> fileList, File targetDir)
  {
    int filesAmount = fileList.size();
    int filesCopied = 0;
    int filesFailed = 0;
    int filesProgress = 0;

    for(File child : fileList){
      try
      {
	Files.copy(child.toPath(), targetDir.toPath().resolve(child.getName()));
	filesCopied += 1;
      } catch(FileAlreadyExistsException e)
      {
/*	System.out.println(
	  ERROR + ANSI.color("Cannot copy file '" + child.getAbsolutePath() + "' to '" + targetDir.getAbsolutePath() + "'. File already exists.", ANSI.RED)
	);
*/
	filesFailed += 1;
      } catch(IOException e)
      {
/*	System.out.println(
	  ERROR + ANSI.color("IO issue when copying '" + child.getAbsolutePath() + "' to '" + targetDir.getAbsolutePath() + "'.", ANSI.RED)
	);
*/
	filesFailed += 1;
      } catch(Exception e)
      {
/*	System.out.println(
	  ERROR + ANSI.color(e.getMessage(), ANSI.RED)
	);
*/
	filesFailed += 1;
      }
      
      filesProgress = (int)((double)(filesCopied + filesFailed) / filesAmount * 100);
      System.out.print(
	ANSI.left(1000) +
	ANSI.color("Copying Progress:", ANSI.BG_GREEN) + 
	" " + 
	(filesCopied+filesFailed) + 
	"/" + 
	filesAmount + 
	"(" +
	filesProgress + "%)"
      );
    }
    
    System.out.println(
      ANSI.color("\nCopy Complete!", ANSI.GREEN) + 
      ANSI.color("\tSuccessful: " + filesCopied, ANSI.GREEN) +
      ANSI.color("\tFailed: " + filesFailed, ANSI.RED)
    );
  }
}
