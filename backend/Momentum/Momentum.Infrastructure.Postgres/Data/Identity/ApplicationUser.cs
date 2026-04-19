using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Momentum.Infrastructure.Data.Identity
{
  public class ApplicationUser : IdentityUser
  {
    public string TimeZoneId { get; set; } = "UTC";
  }
}



