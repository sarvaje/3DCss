using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConversorObjToHTML.Models
{
    public class Face
    {
        public List<int> Vertices { get; set; }
        public List<Vector3D> Points { get; set; }
        public Vector3D Normal { get; set; }
    }
}
