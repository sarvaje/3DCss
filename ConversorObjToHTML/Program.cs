using ConversorObjToHTML.Models;
using ConversorObjToHTML.Vector;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace ConversorObjToHTML
{
    class Program
    {
        static void Main(string[] args)
        {
            List<string> filesToConvert = new List<string>();
            string[] lineSeparators = new string[] { "\r\n" };
            char[] componentsSeparator = new char[] { ' ' };
            char[] vertexCompomentSeparator = new char[] { '/' };

            if (args.Length > 0)
            {
                for (var i = 1; i < args.Length; i++)
                {
                    filesToConvert.Add(args[i]);
                }
            }
            else
            {
                string path = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "\\modelsObj";
                filesToConvert = Directory.GetFiles(path).ToList();
            }

            Console.WriteLine("Detected: " + filesToConvert.Count + " models");
            //Read files
            for (int i = 0; i < filesToConvert.Count; i++)
            {
                using (StreamReader reader = new StreamReader(filesToConvert[i]))
                {
                    string fileContent = reader.ReadToEnd();
                    string objectName = "noname" + i.ToString();
                    string[] lines = fileContent.Split(lineSeparators, StringSplitOptions.RemoveEmptyEntries);

                    List<Vector3D> vertices = new List<Vector3D>();
                    List<int> triangles = new List<int>();
                    List<List<int>> polygons = new List<List<int>>();

                    objectName = GetVerticesAndPolygons(componentsSeparator, vertexCompomentSeparator, objectName, lines, vertices, triangles, polygons);

                    GenerateWaveJsModel(objectName, vertices, triangles, polygons);

                    GenerateHtmlModel(objectName, vertices, triangles, polygons);

                    Console.WriteLine("Created " + objectName + ".js");
                }
            }
            Console.ReadLine();
        }

        private static void GenerateHtmlModel(string objectName, List<Vector3D> vertices, List<int> triangles, List<List<int>> polygons)
        {
            List<Face> faces;

            GetFaces(vertices, triangles, polygons, out faces);

            
        }

        private static void GetFaces(List<Vector3D> vertices, List<int> triangles, List<List<int>> polygons, out List<Face> faces)
        {
            //var trianglesCoords = new List<List<Vector3D>>();
            //var polygonsCoords = new List<List<Vector3D>>();
            faces = new List<Face>();

            for (int i = 0, li = triangles.Count; i < li / 3; i++)
            {
                var triangleCoord = new List<Vector3D>();
                var triangleVertices = new List<int>();
                var face = new Face();
                
                int index = i * 3;

                int tIndex = triangles[index] - 1;

                triangleVertices.Add(tIndex);
                triangleCoord.Add(vertices[tIndex]);

                tIndex = triangles[index + 1] - 1;
                
                triangleVertices.Add(tIndex);
                triangleCoord.Add(vertices[tIndex]);

                tIndex = triangles[index + 2] - 1;

                triangleVertices.Add(tIndex);
                triangleCoord.Add(vertices[tIndex]);

                //trianglesCoords.Add(triangleCoord);

                face.Vertices = triangleVertices;
                face.Points = triangleCoord;
                face.Normal = CalcurateNormal(triangleCoord);
            }

            for (int i = 0, li = polygons.Count; i < li; i++)
            {
                var polygonsCoord = new List<Vector3D>();
                var polygonVertices = new List<int>();
                var face = new Face();

                var polygon = polygons[i];

                for (int j = 0, lj = polygon.Count; j < lj; j++)
                {
                    int pIndex = polygon[j] - 1;

                    polygonsCoord.Add(vertices[pIndex]);
                    polygonVertices.Add(pIndex);
                }

                face.Vertices = polygonVertices;
                face.Points = polygonsCoord;
                face.Normal = CalcurateNormal(polygonsCoord);
            }
        }

        private static Vector3D CalcurateNormal(List<Vector3D> triangleCoord)
        {
            throw new NotImplementedException();
        }

        private static void GenerateWaveJsModel(string objectName, List<Vector3D> vertices, List<int> triangles, List<List<int>> polygons)
        {
            string pathDest = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "\\modelsJs";
            if (!Directory.Exists(pathDest))
            {
                Directory.CreateDirectory(pathDest);
            }
            string fileName = pathDest + "\\" + objectName + ".js";
            //Generate File
            Console.WriteLine("Creating " + objectName + ".js");
            using (StreamWriter writer = new StreamWriter(fileName))
            {
                writer.AutoFlush = true;
                writer.WriteLine("var " + objectName + " = new Model();");
                for (int j = 0; j < vertices.Count; j++)
                {
                    writer.WriteLine(objectName + ".AddVertex(" + vertices[j].X + "," + vertices[j].Y + "," + vertices[j].Z + ");");
                }

                for (int j = 0; j < triangles.Count / 3; j++)
                {
                    int idx = j * 3;
                    writer.WriteLine(objectName + ".AddTriangle(" + (triangles[idx] - 1).ToString() + "," + (triangles[idx + 1] - 1).ToString() + "," + (triangles[idx + 2] - 1).ToString() + ");");
                }

                for (int j = 0; j < polygons.Count; j++)
                {
                    List<int> poligon = polygons[j];
                    StringBuilder sb = new StringBuilder();
                    sb.Append(objectName + ".AddPolygon([" + (poligon[0] - 1).ToString());
                    for (var k = 1; k < poligon.Count; k++)
                    {
                        sb.Append("," + (poligon[k] - 1).ToString());
                    }
                    sb.Append("]);");
                    writer.WriteLine(sb.ToString());
                }
            }
        }

        private static string GetVerticesAndPolygons(char[] componentsSeparator, char[] vertexCompomentSeparator, string objectName, string[] lines, List<Vector3D> vertices, List<int> triangles, List<List<int>> polygons)
        {
            for (int j = 0; j < lines.Length; j++)
            {
                string[] line = lines[j].Replace(".", ",").Trim().Split(componentsSeparator, StringSplitOptions.RemoveEmptyEntries);
                if (line[0] == "v") //It's a vertex
                {
                    Vector3D vector = new Vector3D();
                    vector.X = double.Parse(line[1]);
                    vector.Y = double.Parse(line[2]);
                    vector.Z = double.Parse(line[3]);
                    vertices.Add(vector);
                }

                if (line[0] == "g")
                {
                    if (line[1].ToLower() != "default")
                    {
                        objectName = line[1].ToLower();
                    }
                }

                if (line[0] == "f") //It's a poligon/triangle
                {
                    if (line.Length == 4) //It's a triangle
                    {
                        triangles.Add(int.Parse(line[1]));
                        triangles.Add(int.Parse(line[2]));
                        triangles.Add(int.Parse(line[3]));
                    }
                    else if (line.Length > 4) //It's a poligon
                    {
                        List<int> polygon = new List<int>();
                        for (int k = 1; k < line.Length; k++)
                        {
                            polygon.Add(int.Parse(line[k].Split(vertexCompomentSeparator)[0]));
                        }
                        polygons.Add(polygon);
                    }
                }
            }
            return objectName;
        }
    }
}
